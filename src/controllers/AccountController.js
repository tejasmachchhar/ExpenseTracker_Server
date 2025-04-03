const accountModel = require('../models/AccountsModel').default;

const getAllAccounts = async (req, res) => {
    try{
        const foundAccounts = await accountModel.find();
        res.status(200).json({
            message: 'All accounts found',
            data: foundAccounts,
        });
    }catch(error){
        res.status(500).json({
            message: 'Error finding accounts',
            error: error.message,
        });
    }
}

const createAccount = async (req, res) => {
    try {
        const createdAccount = await accountModel.create(req.body)
        res.status(201).json({
            message: 'Account created successfully',
            data: createdAccount
        })
    }   
    catch (error) {
        res.status(500).json({
            message: 'Error creating account',
            error: error.message
        });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await accountModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            message: 'Account deleted successfully',
            data: deletedAccount
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting account',
            error: error.message
        });
    }
}

const getAccountById = async (req, res) => {
    try {
        const foundRole = await accountModel.findById(req.params.id);
        res.status(200).json({
            message: 'Account fetched successfully',
            data: foundRole
        });
    }
    catch(error) {
        res.status(500).json({
            message: 'error fetching role',
            error: error.message
        });
    }
}   

module.exports = {
    getAllAccounts, createAccount, deleteAccount, getAccountById
}