const express = require('express');
const routes = express.Router();
const path = require('path');

routes.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

routes.get('/test', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});


module.exports = routes;