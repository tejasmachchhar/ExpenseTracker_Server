const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
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
    accountId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'account',
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
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
    timespamp: true,
})

module.exports = mongoose.model('expense', expenseSchema)