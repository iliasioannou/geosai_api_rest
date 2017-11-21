"use strict";

//Level: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const winston = require("winston");
const fs = require("fs");

const numOfRepeat = 30;



const logDir = "log";
const env = process.env.NODE_ENV || "development";
const tsFormat = () => (new Date()).toLocaleTimeString();

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


const log = new(winston.Logger)({
    transports: [
    // colorize the output to the console
    new(winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: env === "development" ? "debug" : "info"
        }),
        new(winston.transports.File)({
            filename: logDir + "/ispra_api.log",
            maxsize: 5 * 1024 * 1024,
            timestamp: tsFormat,
            level: env === "development" ? "debug" : "info",
            //colorize: true,
            json: false,
            logstash: false
        })
  ]
});

// --------- Utils ----------

// var dividerStars = () => {
//     return "*".repeat(20)
// };


var utils = {
    dividerStars: "*".repeat(numOfRepeat),
    dividerHyphens: "-".repeat(numOfRepeat),
    dividerDots: ".".repeat(numOfRepeat),
    dividerEquals: "=".repeat(numOfRepeat)
}


// Public
var pub = {
    log: log,
    utils: utils
}




module.exports = pub;
