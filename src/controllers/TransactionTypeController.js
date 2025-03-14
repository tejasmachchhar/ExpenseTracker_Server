const tranTypeModel = require('../models/TransactionTypeModel');

const getAllTranTypes = async (req, res) => {
    try {
        const foundTranTypes = await tranTypeModel.find();
        res.status(200).json ({
            message: 'Fetched All Transaction Types',
            data: foundTranTypes,
        });
    }catch(error) {
        res.error.status(500).json({
            message: 'Error Fetching Transaction Types',
            error: error.message, 
        });
    }
}

const createTranType = async (req, res) => {
    try {
        const createdTranType = await tranTypeModel.create(req.body);
        res.status(201).json({
            message: 'Transaction Type Created',
            data: createdTranType,
        });
    }catch(error) {
        res.status(500).json ({
            message: 'error creating transaction type',
            error: error.message,
        });
    }
}

module.exports = {
    getAllTranTypes,
    createTranType,
}