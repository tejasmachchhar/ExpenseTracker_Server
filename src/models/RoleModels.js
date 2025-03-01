// databse
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    // fields ///get
    role: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('roles', roleSchema);

// roles[rolesSchema]