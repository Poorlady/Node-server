const express = require('express');
const routes = express.Router();
const path = require('path');

routes.get('/', (req, res, next) => {
    // res.send(JSON.stringify({ message: "Hello World!" }));
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

routes.get('/new-page', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

routes.get('/old-page', (req, res, next) => {
    res.redirect(301, '/new-page'); //default code is 302
});

const one = (req, res, next) => {
    //console.log('one');
    next();
};

const two = (req, res, next) => {
    //console.log('two');
    next();
};

const three = (req, res, next) => {
    //console.log('three');
    res.json({ result: 'middleware success' });
};

routes.get('/testing', [one, two, three]);


module.exports = routes;