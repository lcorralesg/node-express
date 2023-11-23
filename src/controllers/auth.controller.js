import User from '../models/user.model.js';
import VerificationCode from '../models/verificationcode.model.js';
import bcrypt from 'bcrypt';
import {createAccessToken} from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import nodemailer from 'nodemailer';


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'corralesgrandaluisangel@gmail.com',
        pass: 'gkhg jvgr rfoc thiy'
    }
});

const sendEmail = (email, token) => {
    const mailOptions = {
        from: 'corralesgrandaluisangel@gmail.com',
        to: email,
        subject: 'Account Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #007bff; text-align: center;">Hola,</h1>
                <p>Gracias por registrarte en nuestra plataforma. Por favor, verifica tu cuenta utilizando el siguiente token:</p>
                <div style="background-color: #007bff; color: white; padding: 10px; text-align: center; margin: 20px 0;">
                    ${token}
                </div>
                <p>Saludos,</p>
                <p>Luis Corrales</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent');
        }
    });
}

export const preRegister = async (req, res) => {
    const {email, password, username} = req.body;
    try {
        const userFound = await User.findOne({email});
        if(userFound) return res.status(400).json({message: "The email already exists"});

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: passwordHash,
            username,
            isVerified: false
        });
        const userSaved = await newUser.save();
        
        const numberToken = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        const newToken = new VerificationCode({
            code: numberToken,
            userId: userSaved._id,
            //expira en 5 minutos
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });
        const tokenSaved = await newToken.save();
        sendEmail(email, numberToken);

        res.status(200).json({
            id: userSaved._id,
            email: userSaved.email,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const register = async (req, res) => {
    const {id, code} = req.body;

    try {
        if(!id || !code) return res.status(400).json({message: "Missing fields"});
        const codeFound = await VerificationCode.findOne({userId: id, code});
        if(!codeFound) return res.status(400).json({message: "Invalid code"});
        if(codeFound.expiresAt < new Date()) return res.status(400).json({message: "Code expired"});
        const userFound = await User.findById(id);
        if(!userFound) return res.status(400).json({message: "User not found"});
        if(userFound.isVerified) return res.status(400).json({message: "User already verified"});
        userFound.isVerified = true;
        await userFound.save();
        codeFound.isUsed = true;
        await codeFound.save();

        const token = await createAccessToken({id: userFound._id});
        res.cookie("token", token)
        .status(200)
        .json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    } catch (error) {
        res.status(500)
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const userFound = await User.findOne({email});
        if(!userFound) return res.status(400).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, userFound.password);
        if(!isMatch) return res.status(400).json({message: "Incorrect password"});

        const token = await createAccessToken({id: userFound._id});

        res.cookie("token", token)
        .status(200)
        .json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const logout = async (req, res) => {
    res.cookie("token", "", {expires: new Date(0)})
    return res.status(200).json({message: "Logged out"});
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.userId);
    if (!userFound) return res.status(404).json({message: "User not found"});
    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    })
    .status(200)
}

export const verifyToken = async (req, res) => {
    const {token} = req.cookies;
    if(!token) return res.status(401).json({message: "Unauthorized"});
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if(err) return res.status(401).json({message: "Unauthorized"});
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({message: "Unauthorized"});

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
        .status(200)
    })
}