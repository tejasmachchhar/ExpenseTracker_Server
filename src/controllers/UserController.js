const userModel = require('../models/UserModels');
const bcrypt = require("bcrypt");
const { sendingMail } = require('../utils/MailUtil');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const foundUsers = await userModel.find().populate("roleId");
        res.status(200).json({
            message: 'Users fetched successfully',
            data: foundUsers
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching users",
            error: err.message
        })
    }
}

const createUser = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;
        const createdUser = await userModel.create(req.body);
        // console.log(createdUser);
        res.status(201).json({
            message: 'User created successfully',
            data: createdUser
        });
        sendingMail(req.body.email, "Welcome to Expense Tracker", "You have successfully registered to Expense Tracker");
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email == null || password == null) {
            res.status(404).json({
                message: "Please enter email and password"
            })
            return;
        }
        const user = await userModel.findOne({ email }).populate("roleId");
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // console.log(user);
        // console.log('JWT_SECRET:', process.env.JWT_SECRET);
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.roleId.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user,
        });
    } catch (err) {
        res.status(500).json({ message: "Error verifying user", error: err });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id)
        res.status(204).json({
            message: "User deleted successfully",
            data: deletedUser
        })
    } catch (err) {
        res.ststus(500).json({
            message: "Error deleting user",
            error: err.message
        })
    }
}

const findUserById = async (req, res) => {
    try {
        const foundUser = await userModel.findById(req.params.id);
        res.status(200).json({
            message: "User found successfully",
            data: foundUser
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching the user",
            error: err.message
        })
    }
}

const updateUserById = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        })
    } catch (err) {
        res.status(500).json({
            message: "Error updating user",
            error: err.message
        })
    }
}

module.exports = {
    getAllUsers, createUser, deleteUserById, findUserById, loginUser, updateUserById,
}