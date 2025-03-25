const routes = require('express').Router();
const expenseController = require('../controllers/ExpenseController');

routes.get('/expenses', expenseController.getAllExpenses);
routes.post('/expenseWithoutAttachment', expenseController.addExpense);
routes.post('/expense', expenseController.addExpenseWithAttachment);
routes.delete('/expense/:id', expenseController.deleteExpenseById);

module.exports = routes;