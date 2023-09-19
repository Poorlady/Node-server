const jwt = require('jsonwebtoken');
require('dotenv').config;

const verifyJWT = (req, res, next) => {
    //console.log('hit');
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        return res.sendStatus(401);
    }
    //console.log(accessToken);
    const token = accessToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            req.username = decoded.username;
            req.roles = decoded.roles;
            console.log(decoded);
            next();
        }
    });
};

module.exports = verifyJWT;