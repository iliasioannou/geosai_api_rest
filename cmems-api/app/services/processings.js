"use strict";

let logger = require("../utils/log");
let chalk = require('chalk');
let request = require('request');

let logMetadata = {
    module: "services.processing",
    method: ""
};



/**
 * Add processing
 */
let addProcessing = function(processingParams) {
    logMetadata.method = "addProcessing";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(processingParams), logMetadata);

    return new Promise(function(resolve, reject) {

      var options = {
        uri: 'http://temisto.planetek.it:9999/processings',
        method: 'POST',
        json: processingParams
      };
      request(options, function (error, response, body) {

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
