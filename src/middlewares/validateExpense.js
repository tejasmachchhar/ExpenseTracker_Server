const Joi = require('joi');

const expenseSchema = Joi.object({
    userId: Joi.string().required(),
    tranType: Joi.string().valid('income', 'expense').required(),
    amountSpent: Joi.number().required(),
    paidTo: Joi.string().required(),
    dateTime: Joi.date().required(),
    accountId: Joi.string().required(),
    categoryId: Joi.string().required(),
    notes: Joi.string().optional(),
});

const validateExpense = (req, res, next) => {
    const { error } = expenseSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateExpense;