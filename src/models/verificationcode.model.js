import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('VerificationCode', verificationCodeSchema);