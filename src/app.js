import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000",
    "http://localhost:8000", "http://lcorralesg.live:8000",
    "http://lcorralesg.live:5173", "http://lcorralesg.live:3000"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", userRoutes);

export default app;