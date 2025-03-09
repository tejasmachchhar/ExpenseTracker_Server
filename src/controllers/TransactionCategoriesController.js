const TransactionCategoriesModel = require('../models/TransactionCategoriesModel')

const getAllTranCategories = async (req,res) => {
    try {
        const foundTranCategories = await TransactionCategoriesModel.find();
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
            error: error
        })
    }
}

const getTranCatByTranType = async (req, res) => {
    try{
        const foundTranCat = await TransactionCategoriesModel.findById(req.params.id);
        res.status(200).json({
            message: "Transaction Catgories found successfully",
            data: foundTranCat
        })
    }catch(error){

    }
}

module.exports = {
    getAllTranCategories, addTranCategory, getTranCatByTranType
}