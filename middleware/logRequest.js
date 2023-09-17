const logger = require('../helper/logger');

const logRequest = (req, res, next) => {
    const message = `${req.method}\t${req.path}\t${req.headers.origin}`;
    logger(message, 'log.txt');
    next();
};

module.exports = logRequest;