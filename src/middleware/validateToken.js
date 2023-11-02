import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    const {token} = req.cookies;
    if(!token)
        return res.status(401).json({message: "Unauthorized"});
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if(err) return res.status(401).json({message: "Invalid Token"});
            req.userId = decoded.id;
            next();
        }
    );
}
