const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionCategoriesSchema = new Schema({
    category:{
        type: String,
        require: true
    },
    type: {
        enum: ['income', 'expense'],
        type: String,
        require: true
    },
    isTransaction: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('TransactionCategories', TransactionCategoriesSchema)