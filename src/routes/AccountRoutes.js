const routes = require('express').Router();
const AccountController = require('../controllers/AccountController');

routes.get('/accounts', AccountController.getAllAccounts);
routes.post('/account', AccountController.createAccount);
routes.delete('/account/:id', AccountController.deleteAccount);
routes.get('/account/:id', AccountController.getAccountById);

module.exports = routes;