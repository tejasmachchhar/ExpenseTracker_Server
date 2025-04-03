import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

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
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const account = await this.constructor.findOne({ accountNumber: value });
                if (account && account.userId.toString() == this.userId.toString()) {
                    return false;
                } 
                return true;
            },
            message: "Account number already exists for this user",
        },
    },
});

export default model('account',accountSchema);