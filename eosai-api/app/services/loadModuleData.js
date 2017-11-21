/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";
const fs = require("fs");
const logger = require("../utils/log.js");
const chalk = require('chalk');
const Loader = require("./loader/Loader");


const logMetadata = {
    module: "services.loadModuleData",
    method: ""
};

const load = function (inputForLoader) {
    logMetadata.method = "load";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return new Promise(function (resolve, reject) {
        if (inputForLoader === undefined || inputForLoader === null) {
            logger.log.error("Empty inputForLoader", logMetadata);
            reject("Empty inputForLoader");
            return;
        }
        if (inputForLoader.id === undefined || inputForLoader.id === null) {
            logger.log.error("Empty inputForLoader.id", logMetadata);
            reject("Empty inputForLoader.id");
            return;
        }
        if (inputForLoader.path === undefined || inputForLoader.path === null) {
            logger.log.error("Empty inputForLoader.path", logMetadata);
            reject("Empty inputForLoader.path");
            return;
        }
        if (inputForLoader.sheets === undefined || inputForLoader.sheets === null) {
            logger.log.error("Empty inputForLoader.sheets", logMetadata);
            reject("Empty inputForLoader.sheets");
            return;
        }

        const objLoader = new Loader();
        objLoader.storeMonitoringFileIntoDatabase(
                inputForLoader.id,
                inputForLoader.path,
                inputForLoader.sheets
            )
            .then(function (result) {
                logger.log.debug("Module have been loaded ?", result, logMetadata);
                if (result !== undefined) {
                    resolve(result);
                } else {
                    logger.log.error("Empty load result", logMetadata);
                    reject("Empty load result");
                }
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

// Public
const pub = {
    load: load
};

module.exports = pub;