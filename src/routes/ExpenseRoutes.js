const express = require('express');
const expenseController = require('../controllers/ExpenseController');
const validateExpense = require('../middlewares/validateExpense');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/expenses', expenseController.getAllExpenses);
router.get('/userExpenses', expenseController.getExpenseByUserId);
router.post('/expenseWithoutAttachment', expenseController.addExpense);
// routes.post('/expense', validateExpense, expenseController.addExpenseWithAttachment);
router.post('/expense', expenseController.addExpenseWithAttachment);
router.put('/expense/:id', expenseController.updateExpenseById);
router.delete('/expense/:id', expenseController.deleteExpenseById);
router.get('/dashboard', authenticate, expenseController.dashboardData);
router.get('/daily-trends', authenticate, expenseController.getDailyTrends);

module.exports = router;