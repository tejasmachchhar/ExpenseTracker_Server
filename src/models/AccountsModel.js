const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('account',accountSchema);