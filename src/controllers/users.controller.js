import User from '../models/user.model.js';

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users)
    .status(200);
}
export const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).json({message: "User not found"});
    res.status(204);
}