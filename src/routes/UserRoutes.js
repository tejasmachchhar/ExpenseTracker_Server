const routes = require('express').Router();
const userController = require('../controllers/UserController')

routes.get('/users', userController.getAllUsers);
routes.post('/user', userController.createUser);
routes.post('/user/login', userController.loginUser);
routes.delete('/user/:id', userController.deleteUserById);
routes.get('/user/:id', userController.findUserById);
routes.put('/user/:id', userController.updateUserById);
// routes.post('/user/verify', userController.verifyUser); // Why?

module.exports = routes;