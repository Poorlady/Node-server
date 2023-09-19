const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/usersController');
const handleRoutes = require('../../middleware/routeAuth');
const roles = require("../../config/roleList");

routes.route('/')
    .get(handleRoutes(roles.ADMIN, roles.EDITOR, roles.USER), userController.getUsers)
    .post(handleRoutes(roles.ADMIN, roles.EDITOR), userController.addUser)
    .put(handleRoutes(roles.ADMIN, roles.EDITOR), userController.updateUser)
    .delete(handleRoutes(roles.ADMIN), userController.deleteUser);

module.exports = routes;