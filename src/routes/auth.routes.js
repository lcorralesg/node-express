import {Router} from 'express';
import {login, register, preRegister, logout, profile, verifyToken} from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/validateToken.js';


const router = Router();

router.post('/pre-register', preRegister);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/verify', verifyToken);

router.get('/profile', authRequired, profile);

export default router;