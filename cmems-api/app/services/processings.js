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
      request(options, function (error, response, body) {
        logger.log.debug("Error: " + error);
        logger.log.debug("Response: " + response);
        if (!error && response.statusCode == 201) {
          resolve(true);
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
