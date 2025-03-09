const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amountSpent: {
        type: String,
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
    account:{
        type: Schema.Types.ObjectId,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ''
    },
    notes: {
        type: String,
        required: true
    },
    attachment:{
        type: Image
    },

}, {
    timespamp: true
})

module.exports = mongoose.model('expense', expenseSchema)