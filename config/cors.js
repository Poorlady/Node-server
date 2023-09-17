const whiteList = [
    'localhost:3500',
    'http://127.0.0.1:3500'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.findIndex(item => item === origin) !== -1 || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;