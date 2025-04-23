const routes = require('express').Router();
const expenseController = require('../controllers/ExpenseController');
const validateExpense = require('../middlewares/validateExpense');

routes.get('/expenses', expenseController.getAllExpenses);
routes.get('/userExpenses', expenseController.getExpenseByUserId);
routes.post('/expenseWithoutAttachment', expenseController.addExpense);
// routes.post('/expense', validateExpense, expenseController.addExpenseWithAttachment);
routes.post('/expense', expenseController.addExpenseWithAttachment);
routes.put('/expense/:id', expenseController.updateExpenseById);
routes.delete('/expense/:id', expenseController.deleteExpenseById);

module.exports = routes;