"use strict";
let validator = require("validator");
var moment = require("moment");
let logger = require("./log");

let logMetadata = {
    module: "utils.util",
    method: ""
};

const formatDate_YYYY_MM_DD = function(dateToFormat) {
    return (moment(dateToFormat).format("YYYY-MM-DD"));
}

const fromBase64ToAscii = function(stringToConvert) {
    return (new Buffer(stringToConvert, 'base64').toString('ascii'));
}

const getUserFromBaseAuthentication = function(baseAuthentication) {
    var authPlain = fromBase64ToAscii(baseAuthentication);
    console.log("authPlain: %s", authPlain);

    var usernamePassword = authPlain.split(":");
    var username = usernamePassword[0];
    if (username == undefined || username == null) {
        username = "";
    }
    console.log("username: %s", username);


    var password = usernamePassword[1];
    if (password == undefined || password == null) {
        password = "";
    }
    console.log("password: %s", password);

    var user = {
        "username": "",
        "password": ""
    };
    user.username = username;
    user.password = password;
    return user;
}

const getExtremOfTemporalPeriod = function(fromToPeriod, fromTo) {
    logMetadata.method = "getFromOfTemporalPeriod";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input fromToPeriod = %s", fromToPeriod, logMetadata);
    logger.log.debug("input fromTo = %s", fromTo, logMetadata);

    fromTo = fromTo || 0;
    let extrem = null;

    if (fromToPeriod !== undefined) {
        let arrayPeriod = fromToPeriod.split(",");
        if (arrayPeriod.length == 2) {
            let from = validator.toDate(arrayPeriod[0]);
            let to = validator.toDate(arrayPeriod[1])
            logger.log.debug("Period from = %s, to = %s", formatDate_YYYY_MM_DD(from), formatDate_YYYY_MM_DD(to), logMetadata);
            extrem = (fromTo === 0) ? from : to;
        }
        else {
            logger.log.error("input is null", logMetadata);
        }
        return extrem;
    }
};

const getFromOfTemporalPeriod = function(fromToPeriod) {
    return getExtremOfTemporalPeriod(fromToPeriod, 0);
};

const getToOfTemporalPeriod = function(fromToPeriod) {
    return getExtremOfTemporalPeriod(fromToPeriod, 1);
};

const isTemporalPeriodValid = function(fromToPeriod) {
    return isTemporalFromToValid(getFromOfTemporalPeriod(fromToPeriod), getToOfTemporalPeriod(fromToPeriod));
}


const isTemporalFromToValid = function(from, to) {
    logMetadata.method = "isTemporalPeriodValid";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input from = %s", formatDate_YYYY_MM_DD(from), logMetadata);
    logger.log.debug("input to = %s", formatDate_YYYY_MM_DD(to), logMetadata);

    let isValid = false;
    if (from !== undefined && to !== undefined) {
        let fromDate = validator.toDate(from);
        let toDate = validator.toDate(to)
        isValid = (fromDate !== null && toDate !== null && fromDate < toDate && validator.isBefore(fromDate) && validator.isBefore(toDate));
    }
    logger.log.debug("Period is valid ?  %s", (isValid) ? "SI" : "NO", logMetadata);
    return isValid;
}

// Public
var pub = {
    fromBase64ToAscii: fromBase64ToAscii,
    getUserFromBaseAuthentication: getUserFromBaseAuthentication,
    isTemporalPeriodValid: isTemporalPeriodValid,
    getFromOfTemporalPeriod: getFromOfTemporalPeriod,
    getToOfTemporalPeriod: getToOfTemporalPeriod,
    formatDate_YYYY_MM_DD: formatDate_YYYY_MM_DD
}


module.exports = pub;
