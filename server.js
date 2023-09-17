const express = require('express');
const path = require('path');
const cors = require('cors');
const logRequest = require('./middleware/logRequest');
const logError = require('./middleware/logError');
const corsOptions = require('./config/cors');
const server = express();
const PORT = 3500;

server.use(cors(corsOptions));

server.use(logRequest);

// built in middleware from express to handle urlendcoded data
// in other words, form data:
// content-type: application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }));
// for json
server.use(express.json());
// serve static files
server.use(express.static(path.join(__dirname, 'public')));

// my own routes'
server.use('/', require('./routes/root'));

server.use('/subdir', require('./routes/subdir'));

server.use('/api/users', require('./routes/api/users'));

// server.get('/*', (req, res, next) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

server.all('*', (req, res, next) => {
    res.status(400);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: "404 Not Found!" });
    } else {
        res.type('txt').send("404 Not Found!");
    }
});

server.use(logError);

server.listen(PORT, () => console.log('server is up and running'));