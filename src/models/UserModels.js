const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        default: "67c138b76acafdcf94ed4b2b",
        required: true,
        ref: "roles" //Collection name
    }
}, {
    timestamp: true
})

module.exports = mongoose.model('users', userSchema);