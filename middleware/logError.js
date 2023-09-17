const logger = require('../helper/logger');

const logError = (err, req, res, next) => {
    const message = `${err.name}: ${err.message}`;
    logger(message, 'error.txt');
    res.status(500).send(err.message);
};

module.exports = logError;