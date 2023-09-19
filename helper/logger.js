const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const logger = (message, fileName) => {
    const date = format(new Date(), "EEEE,doMMMyyyy\tHH:mm:ss");
    const logFormat = `${date}\t${uuid.v4()}\t${message}\n`;
    // //console.log(path.join(__dirname, '..', 'log'));
    // check if the folder exist
    if (!fs.existsSync(path.join(__dirname, '..', 'log'))) {
        fs.mkdir(path.join(__dirname, '..', 'log'), (err) => {
            if (err) {
                //console.log(err);
            }
        });
    }
    // append content to file
    fs.appendFile(path.join(__dirname, '..', 'log', fileName), logFormat, (err) => {
        if (err) {
            //console.log(err);
        }
    });
};

module.exports = logger;