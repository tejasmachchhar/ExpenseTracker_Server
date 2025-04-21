const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    tranType: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'tranTypeModel',
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'TransactionCategories',
    },
    accountId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'account',
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);