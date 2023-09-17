const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/usersController');

routes.route('/')
    .get(userController.getUsers)
    .post(userController.addUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = routes;