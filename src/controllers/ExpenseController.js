const expenseModel = require("../models/ExpenseModel");
const multer = require('multer');
const path = require('path');
const cloudinaryUtil = require('../utils/CloudinaryUtil');

// Storage engine (to store attachment in server file system)
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        // console.log("Multer: " + req + ", Res: " + res);
        cb(null, file.originalname);
    },
});

// multer object
const upload = multer({
    storage: storage,
    // filerFilter:
}).single('image');

const getAllExpenses = async (req, res) => {
    try {
        const foundExpenses = await expenseModel.find();
        res.status(200).json({
            messsage: "All Expenses",
            data: foundExpenses,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching Expenses',
            error: error.message
        });
    }
}

const addExpense = async (req, res) => {
    try {
        const addedExpense = await expenseModel.create(req.body);
        res.status(200).jsom({
            message: 'Expense added successfully',
            data: addedExpense,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding expense',
            error: error.message,
        });
    }
}

// 1. store image in server file system (uploads folder)
// 2. then cloudinary cloud DB
// 3. then cloudinary url into MongoDB
const addExpenseWithAttachment = async (req, res) => {
    // upload image to server file system
    upload(req, res, async (err) => {
        if (err) {
            console.error("if err upload: " + req + ", Res: " + res);
            res.status(500).json({
                message: 'Error adding expense',
                error: err.message,
            });
        } else {
            console.log("Request headers:", req.headers);
            console.log("Request body:", req.body);
            console.log("File received:", req.file);

            if (!req.file) {
                return res.status(400).json({
                    message: 'No file detected',
                });
            }

            // database data store
            try {
                // cloudinary
                const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
                console.log(cloudinaryResponse);
                console.log(req.body);

                // store data in database (MongoDB)
                req.body.attachmentUrl = cloudinaryResponse.secure_url;
                const savedExpense = await expenseModel.create(req.body);
                res.status(200).json({
                    message: 'Expense added successfully',
                    data: savedExpense,
                });
            } catch (error) {
                console.error('Database error: ', error);
                res.status(500).json({
                    message: 'Error adding expense',
                    error: error.message,
                });
            }
        }
    });
}

const deleteExpenseById = async (req, res) => {
    try {
        const deletedExpense = await expenseModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Expense deleted successfully',
            data: deletedExpense,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting expense',
            error: error.message,
        });
    }
}

module.exports = {
    getAllExpenses, addExpense, addExpenseWithAttachment, deleteExpenseById,
}