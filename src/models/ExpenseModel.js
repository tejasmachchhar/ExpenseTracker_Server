const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    tranType: {
        type: String,
        required: true
    },
    amountSpent: {
        type: Number,
        required: true
    },
    paidTo: {
        type: String,
        required: true
    },
    dateTime:{
        type: Number,
        required: true,
    },
    account : {
        type: String,
        required: true
    },
    accountId:{
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'account',
    },
    category : {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'TransactionCategories',
    },
    notes: {
        type: String,
        required: true
    },
    attachmentUrl:{
        type: String,
    },
}, {
    timestamp: true,
})

module.exports = mongoose.model('expense', expenseSchema)