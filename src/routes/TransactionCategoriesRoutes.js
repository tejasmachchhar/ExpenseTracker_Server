const routes = require('express').Router();
const TranCategoriesController = require('../controllers/TransactionCategoriesController');

routes.get('/tranCategories', TranCategoriesController.getAllTranCategories);
routes.post('/addTranCategory', TranCategoriesController.addTranCategory);
routes.post('/getTranCatByTranType/:TranTypeId', TranCategoriesController.getTranCatByTranType);


module.exports = routes;