"use strict";

let logger = require("../utils/log");
let chalk = require('chalk');
let request = require('request');

let logMetadata = {
    module: "services.processing",
    method: ""
};
let apiProcessingConfig = require("../config/apiProcessingConfig.js");
let host = apiProcessingConfig.host + "/processings";

/**
 * Add processing
 */
let addProcessing = function(processingParams) {
    logMetadata.method = "addProcessing";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(processingParams), logMetadata);

    return new Promise(function(resolve, reject) {

      var options = {
        uri: host,
        method: 'POST',
        json: processingParams
      };

      logger.log.debug("Options: " + JSON.stringify(options));

      request(options, function (error, response, body) {
        logger.log.debug("Error: " + JSON.stringify(error));
        logger.log.debug("Response: " + JSON.stringify(response));
        logger.log.debug("Body: " + JSON.stringify(body));
        if (!error) {
          resolve(response);
        } else {
          reject(error);
        }
      });
    });
}

// Public
let pub = {
    addProcessing: addProcessing
}

module.exports = pub
