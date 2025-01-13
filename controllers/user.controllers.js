const User = require('../models/User.model');
const mongoose = require('mongoose');

const getAllUsers = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const users = await User.find().skip(skip).limit(Number(limit));
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getAllUsersPopulated = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query

    User
        .find()
        .skip((page - 1) * Number(limit))
        .limit(Number(limit))
        .populate('sales')
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            res.json(users)
        })
        .catch(err => {
            console.error("Error fetching users:", err)
            next(err)
        })
};

const getUser = async (req, res, next) => {
    const { id } = req.params;
    console.log('cual es el id del usuario:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(id).populate('sales');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const editUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const avatar = req.file ? req.file.path : null;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const updateData = { username, email, role };
    if (avatar) {
        updateData.avatar = avatar;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, updateData, { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const filterUsers = async (req, res, next) => {
    const { query } = req.query

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const users = await User.find({ $text: { $search: query } });
        res.json(users)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getAllUsersPopulated,
    getUser,
    editUser,
    filterUsers,
    deleteUser
};
