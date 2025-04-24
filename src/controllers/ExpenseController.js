const mongoose = require('mongoose');
const expenseModel = require("../models/ExpenseModel");
const multer = require('multer');
const path = require('path');
const cloudinaryUtil = require('../utils/CloudinaryUtil');
const fs = require('fs');


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
        // console.log("Request headers:", req.headers);
        const foundExpenses = await expenseModel.find();
        res.status(200).json({
            messsage: "All Expenses",
            data: foundExpenses,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching Expenses',
            error: error.message,
        });
    }
}

const getExpenseByUserId = async (req, res) => {
    try {
        // console.log("Request headers:", req.headers);
        const foundExpenses = await expenseModel.find({ userId: req.userId });
        // const foundExpenses = await expenseModel.find({ userId: req.body.user._id });
        res.status(200).json({
            message: "All Expenses for userId: " + req.userId,
            data: foundExpenses,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching Expenses',
            error: error.message,
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
            // console.log("Request headers:", req.headers);
            // console.log("Request body:", req.body);
            // console.log("File received:", req.file);

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
                req.body.userId = req.userId; // Attach userId to request object
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

        // console.log("Request headers:", req.headers);
        // console.log("Request body:", req.body);
        // console.log("File received:", req.file);

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

const dashboardData = async (req, res) => {
    try {
        const userId = req.userId;
        // console.log("Raw userId from request:", userId);
        const userObjectId = new mongoose.Types.ObjectId(userId);
        // console.log("Converted userId to ObjectId:", userObjectId);

        // 1. Total expenses and income
        const totalsByType = await expenseModel.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: "$tranType",
                    total: { $sum: "$amountSpent" }
                }
            }
        ]);

        // 2. This month's totals by type
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getTime();

        const thisMonthTotalsByType = await expenseModel.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    dateTime: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$tranType",
                    total: { $sum: "$amountSpent" }
                }
            }
        ]);

        // 3. Monthly average by type
        const allMonthsExpensesByType = await expenseModel.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: "$dateTime" } },
                        month: { $month: { $toDate: "$dateTime" } },
                        tranType: "$tranType"
                    },
                    monthlyTotal: { $sum: "$amountSpent" }
                }
            }
        ]);

        // Calculate averages by type
        const expenseMonths = allMonthsExpensesByType.filter(m => m._id.tranType === 'expense');
        const incomeMonths = allMonthsExpensesByType.filter(m => m._id.tranType === 'income');

        const monthlyAverageExpense = expenseMonths.length > 0 
            ? expenseMonths.reduce((acc, curr) => acc + curr.monthlyTotal, 0) / expenseMonths.length
            : 0;
        
        const monthlyAverageIncome = incomeMonths.length > 0
            ? incomeMonths.reduce((acc, curr) => acc + curr.monthlyTotal, 0) / incomeMonths.length
            : 0;

        // 4. Category wise totals by transaction type
        const categoryWiseTotal = await expenseModel.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: {
                        category: "$category",
                        tranType: "$tranType"
                    },
                    total: { $sum: "$amountSpent" }
                }
            },
            {
                $lookup: {
                    from: "transactioncategories",
                    localField: "_id.category",
                    foreignField: "category",
                    as: "categoryInfo"
                }
            },
            {
                $project: {
                    categoryName: { $arrayElemAt: ["$categoryInfo.category", 0] },
                    tranType: "$_id.tranType",
                    total: 1
                }
            }
        ]);

        // Separate categories by transaction type
        const expenseCategories = categoryWiseTotal
            .filter(cat => cat.tranType === 'expense')
            .map(({ categoryName, total }) => ({ categoryName, total }));

        const incomeCategories = categoryWiseTotal
            .filter(cat => cat.tranType === 'income')
            .map(({ categoryName, total }) => ({ categoryName, total }));

        const findTotal = (array, type) => array.find(item => item._id === type)?.total || 0;
        const findMonthTotal = (array, type) => array.find(item => item._id === type)?.total || 0;

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            data: {
                income: {
                    total: findTotal(totalsByType, 'income'),
                    thisMonth: findMonthTotal(thisMonthTotalsByType, 'income'),
                    monthlyAverage: monthlyAverageIncome,
                    categories: incomeCategories
                },
                expense: {
                    total: findTotal(totalsByType, 'expense'),
                    thisMonth: findMonthTotal(thisMonthTotalsByType, 'expense'),
                    monthlyAverage: monthlyAverageExpense,
                    categories: expenseCategories
                }
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
}

const getDailyTrends = async (req, res) => {
    try {
        const userId = req.userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Parse dates handling both timestamp and date string formats
        const parseDate = (dateValue) => {
            if (!dateValue) return new Date();
            // Try parsing as timestamp first
            const timestampDate = new Date(Number(dateValue));
            if (!isNaN(timestampDate.getTime())) return timestampDate;
            // If not a valid timestamp, try parsing as date string
            const stringDate = new Date(dateValue);
            if (!isNaN(stringDate.getTime())) return stringDate;
            throw new Error('Invalid date format');
        };

        try {
            const endDate = parseDate(req.query.endDate);
            const startDate = req.query.startDate 
                ? parseDate(req.query.startDate)
                : new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));

            // console.log('Parsed dates:', {
            //     startDate: startDate.toISOString(),
            //     endDate: endDate.toISOString(),
            //     startTimestamp: startDate.getTime(),
            //     endTimestamp: endDate.getTime()
            // });

            // Set time to start and end of day
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            const dailyTrends = await expenseModel.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        dateTime: {
                            $gte: startDate.getTime(),
                            $lte: endDate.getTime()
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: "$dateTime" }
                                }
                            },
                            tranType: "$tranType"
                        },
                        total: { $sum: "$amountSpent" }
                    }
                },
                {
                    $sort: { "_id.date": 1 }
                }
            ]);

            // Transform the data into a more frontend-friendly format
            const transformedData = dailyTrends.reduce((acc, curr) => {
                const date = curr._id.date;
                const type = curr._id.tranType;
                const amount = curr.total;

                if (!acc[date]) {
                    acc[date] = {
                        date,
                        expense: 0,
                        income: 0
                    };
                }

                acc[date][type] = amount;
                return acc;
            }, {});

            // Convert to array and fill in missing dates
            const result = [];
            const currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                result.push({
                    date: dateStr,
                    expense: transformedData[dateStr]?.expense || 0,
                    income: transformedData[dateStr]?.income || 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // console.log("Daily trends result:", {
            //     resultLength: result.length,
            //     firstDate: result[0]?.date,
            //     lastDate: result[result.length - 1]?.date,
            //     sampleData: result.slice(0, 2)
            // });

            res.status(200).json({
                message: "Daily trends data fetched successfully",
                data: result
            });

        } catch (parseError) {
            return res.status(400).json({
                message: 'Invalid date parameters',
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                error: parseError.message
            });
        }

    } catch (error) {
        console.error('Error fetching daily trends:', error);
        res.status(500).json({
            message: 'Error fetching daily trends data',
            error: error.message
        });
    }
};


module.exports = {
    getAllExpenses, 
    addExpense, 
    addExpenseWithAttachment, 
    updateExpenseById, 
    deleteExpenseById, 
    getExpenseByUserId,
    dashboardData,
    getDailyTrends
}