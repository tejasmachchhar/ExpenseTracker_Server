const TransactionCategoriesModel = require('../models/TransactionCategoriesModel')

const getAllTranCategories = async (req,res) => {
    try {
        const foundTranCategories = await TransactionCategoriesModel.find().populate("TranTypeId");
        res.status(200).json({
            message: 'Transaction Categories fetched successfully',
            data: foundTranCategories
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching Transaction Categories',
            error: error
        })
    }
}

const addTranCategory = async (req,res) => {
    try {
        const addedTranCategories = await TransactionCategoriesModel.create(req.body);
        res.status(200).json({
            message: 'Transaction Category added successfully',
            data: addedTranCategories
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error adding Transaction Categories',
            error: error.message,
        });
    }
}

const getTranCatByTranType = async (req, res) => {
    try{
        const foundTranCatByTranType = await TransactionCategoriesModel.find({ TranTypeId: req.params.TranTypeId}).populate("TranTypeId");
        res.status(200).json({
            message: "Transaction Categories found successfully",
            data: foundTranCatByTranType,
        });
    }catch(error){
        res.status(500).json({
            message: "Error getting transaction categories by transaction type",
            error: error.message,
        });
    }
}

module.exports = {
    getAllTranCategories, addTranCategory, getTranCatByTranType
}