const routes = require('express').Router();
const expenseController = require('../controllers/ExpenseController');

routes.get('/expenses', expenseController.getAllExpenses);
routes.post('/expenseWithoutAttachment', expenseController.addExpense);
routes.post('/expense', expenseController.addExpenseWithAttachment);

module.exports = routes;