const routes = require('express').Router();
const TranCategoriesController = require('../controllers/TransactionCategoriesController');

routes.get('/tranCategories', TranCategoriesController.getAllTranCategories);
routes.post('/addtranCategory', TranCategoriesController.addTranCategory);
routes.post('/getTranCatByTranType:id', TranCategoriesController.getTranCatByTranType);


module.exports = routes;