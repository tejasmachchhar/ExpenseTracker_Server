const routes = require('express').Router();
const expenseController = require('../controllers/ExpenseController');
const validateExpense = require('../middlewares/validateExpense');
const authenticate = require('../middlewares/authenticate');

routes.get('/expenses', authenticate, expenseController.getAllExpenses);
routes.post('/expenseWithoutAttachment', expenseController.addExpense);
routes.post('/expense', validateExpense, expenseController.addExpenseWithAttachment);
routes.put('/expense/:id', expenseController.updateExpenseById);
routes.delete('/expense/:id', expenseController.deleteExpenseById);

module.exports = routes;