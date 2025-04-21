const expenseModel = require("../models/ExpenseModel");
const multer = require('multer');
const path = require('path');
const cloudinaryUtil = require('../utils/CloudinaryUtil');
const Joi = require('joi');

const expenseSchema = Joi.object({
    userId: Joi.string().required(),
    tranType: Joi.string().valid('income', 'expense').required(),
    amountSpent: Joi.number().required(),
    paidTo: Joi.string().required(),
    dateTime: Joi.date().required(),
    accountId: Joi.string().required(),
    categoryId: Joi.string().required(),
    notes: Joi.string().optional(),
});

const validateExpense = (req, res, next) => {
    const { error } = expenseSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    // filerFilter:
}).single('attachmentUrl');

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
        res.status(200).json({
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
            console.error("if err upload: " + req + ", Res: " + res + ", err: " + err);
            res.status(500).json({
                message: 'Error adding expense',
                error: err.message,
            });
        } else {
            console.log("Request headers:", req.headers);
            console.log("Request body:", req.body);
            console.log("File received:", req.file);

            // if (!req.file) {
            //     res.status(400).json({
            //         message: 'No file detected',
            //     });
            // }

            // database data store
            try {
                if (req.file) {
                    // cloudinary
                    const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
                    // store url in database (MongoDB)
                    req.body.attachmentUrl = cloudinaryResponse.secure_url;
                    console.log('cloudinaryResponse: ' + cloudinaryResponse);
                }
                // console.log('req.body:' + req.body);

                // store data in database (MongoDB)
                req.body.dateTime = new Date(req.body.dateTime).getTime(); // Convert date to timestamp
                // console.log('req.body after: ' + req.body);
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

const updateExpenseById = async (req, res) => {
    // Upload image to server file system
    upload(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({
                message: 'Error updating expense',
                error: err.message,
            });
        }

        console.log("Request headers:", req.headers);
        console.log("Request body:", req.body);
        console.log("File received:", req.file);

        try {
            // Find the existing expense to get the old attachment URL
            const existingExpense = await expenseModel.findById(req.params.id);
            if (!existingExpense) {
                return res.status(404).json({
                    message: 'Expense not found',
                });
            }

            // If a file is uploaded, delete the old file and upload the new one
            if (req.file) {
                // Delete the old file from Cloudinary
                if (existingExpense.attachmentUrl) {
                    const publicId = existingExpense.attachmentUrl.split('/').pop().split('.')[0]; // Extract public ID
                    await cloudinaryUtil.deleteFileFromCloudinary(publicId);
                }

                // Delete the old file from the server file system
                if (existingExpense.attachmentUrl) {
                    const oldFilePath = `./uploads/${existingExpense.attachmentUrl.split('/').pop()}`; // Extract file name
                    fs.unlink(oldFilePath, (err) => {
                        if (err) {
                            console.error("Error deleting old file from server:", err);
                        } else {
                            console.log("Old file deleted from server:", oldFilePath);
                        }
                    });
                }

                // Upload the new file to Cloudinary
                const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
                console.log("Cloudinary response:", cloudinaryResponse);
                req.body.attachmentUrl = cloudinaryResponse.secure_url;
            }

            // Update the expense in the database
            req.body.attachmentUrl = req.body.attachmentUrl || existingExpense.attachmentUrl; // Use old URL if no new file is uploaded
            req.body.dateTime = new Date(req.body.dateTime).getTime(); // Convert date to timestamp
            const updatedExpense = await expenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

            res.status(200).json({
                message: 'Expense updated successfully',
                data: updatedExpense,
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({
                message: 'Error updating expense',
                error: error.message,
            });
        }
    });
};

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
    getAllExpenses, addExpense, addExpenseWithAttachment, updateExpenseById, deleteExpenseById, validateExpense
}