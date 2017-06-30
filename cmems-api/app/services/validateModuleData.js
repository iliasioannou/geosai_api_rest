/*jshint esversion: 6*/
/*jshint node: true*/
"use strict";
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const json2xls = require('json2xls');
const logger = require("../utils/log");
const configuration = require("../config/serverConfig.js");
const trasform = require("../utils/trasformValidatorResult");
const Validator = require("./validator/Validator");

const MODULE_NAME = "       [services.validateModuleData].";

const validate = function (inputForValidator) {
    let logMetadata = MODULE_NAME +  "validate";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return new Promise(function (resolve, reject) {
        if (inputForValidator === undefined || inputForValidator === null) {
            logger.log.error("Empty inputForValidator", logMetadata);
            reject("Empty inputForValidator");
            return;
        }
        if (inputForValidator.path === undefined || inputForValidator.path === null) {
            logger.log.error("Empty inputForValidator.path", logMetadata);
            reject("Empty inputForValidator.path");
            return;
        }
        if (inputForValidator.moduleName === undefined || inputForValidator.moduleName === null) {
            logger.log.error("Empty inputForLoader.moduleName", logMetadata);
            reject("Empty inputForLoader.moduleName");
            return;
        }
        if (inputForValidator.code === undefined || inputForValidator.code === null) {
            logger.log.error("Empty inputForLoader.code", logMetadata);
            reject("Empty inputForLoader.moduleName");
            return;
        }        

        const objValidator = new Validator({
            writeJsonDataToFile: true,
            writeJsonValidationToFile: true
        });

        objValidator.validateMonitoringFileByModule(
                inputForValidator.path,
                inputForValidator.moduleName,
                inputForValidator.code
            )
            .then(function (result) {
                //logger.log.debug("Validation result: %s", JSON.stringify(result) , logMetadata);
                if (result) {
                    logger.log.debug("Module is valid (compliant) ?", result.valid, logMetadata);
/*
                    if (result.valid === false) {
                        logger.log.debug("Module isn't valid (compliant). Create XLSX", logMetadata);
                        let jsonTransformed = trasform.transform(result);
                        const optionsXls = {
                            fields: {
                                foglio: "string",
                                riga: "number",
                                colonna: "string",
                                messaggio: "string"
                            }
                        };
                        let xls = json2xls(jsonTransformed, optionsXls);
                        let fileProperties = path.parse(inputForValidator.path);
                        logger.log.debug("Module isn't valid (compliant). Create XLSX", logMetadata);
                        let fileNameXls = fileProperties.dir + path.sep + fileProperties.name + configuration.validationModule.suffixValidationResult +  ".xlsx";
                        fs.writeFileSync(fileNameXls, xls, "binary");
                        logger.log.debug("Create file: %s", fileNameXls, logMetadata);
                    }
*/                    
                    resolve(result);
                } else {
                    logger.log.error("Empty validation result", logMetadata);
                    reject("Empty validation result");
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
    validate: validate
};

module.exports = pub;