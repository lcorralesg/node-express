import User from '../models/user.model.js';

export const getUsers = async (req, res) => {
    const users = await User.find({ isVerified: true });
    res.json(users)
    .status(200);
}
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};