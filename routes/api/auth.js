const express = require('express');
const { registerUser, loginUser, handleRefreshToken, handleLogOut } = require('../../controllers/authController');
const routes = express.Router();

routes.route('/register')
    .post(registerUser);

routes.route('/login')
    .post(loginUser);

routes.route('/refresh')
    .post(handleRefreshToken);

routes.route('/logout')
    .get(handleLogOut);

module.exports = routes;