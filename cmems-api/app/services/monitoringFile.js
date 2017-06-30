/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";
const path = require("path");
const chalk = require("chalk");
const configuration = require("../config/serverConfig.js");
const repositoryMonitoringFile = require("../repositories/monitoringFile");
const bookshelf = require("../repositories/base");
const loadModuleData = require("./loadModuleData");
const validateModuleData = require("./validateModuleData");
const logger = require("../utils/log");
const utils = require("../utils/util");

const PARAMS_SEPARATOR = ";";
const PARAM_VALUE_SEPARATOR = "::";
const FILTER_DATE_SEPARATOR = ",";

const MODULE_NAME = "       [services.monitoringFile].";

/**
 * @return {[type]}
 */
const getMonitoringFileStatuss = function () {
    let logMetadata = MODULE_NAME + "getMonitoringFileStatuss";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFileStatus
            .forge()
            .query(function queryBuilder(qb) {
                qb.orderBy("name", "asc");
            })
            .fetchAll()
            .then(function (collection) {
                logger.log.debug("MonitoringFileStatus collection: %s", JSON.stringify(collection.toJSON()));
                resolve(collection);
            }).catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

/**
 * @param  {[type]}
 * @return {[type]}
 */
const getMonitoringFileStatus = function (idFileStatus) {
    let logMetadata = MODULE_NAME + "getMonitoringFileStatus";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idFileStatus: %s", idFileStatus, logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFileStatus
            .forge({
                idFileStatus: idFileStatus
            })
            .fetch()
            .then(function (status) {
                logger.log.debug("Status: %s", JSON.stringify(status), logMetadata);
                resolve(status);
            }).catch(function (err) {
                logger.log.error("Problem during MonitoringFileStatus read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const getMonitoringFiles = function (filter, sort, paginate) {
    let logMetadata = MODULE_NAME + "getMonitoringFiles";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("paginate: %s", JSON.stringify(paginate), logMetadata);
    logger.log.debug("filter: %s", filter, logMetadata);
    logger.log.debug("sort: %s", sort, logMetadata);
    sort = typeof sort !== "undefined" ? sort : "name::ASC";

    function createFilter(qb) {
        if (!filter) {
            return null;
        }
        let filterArray = filter.split(PARAMS_SEPARATOR);
        logger.log.debug("filterArray: %s", filterArray, logMetadata);
        qb.where("idMonitoringFile", ">", 0);
        for (var filterParam in filterArray) {
            let param = filterArray[filterParam].split(PARAM_VALUE_SEPARATOR);
            let paramName = param[0];
            let paramValue = param[1];
            logger.log.debug("filter.param %d: %s=%s", filterParam, paramName, paramValue, logMetadata);
            if ((paramName.toLowerCase() === "acquisition") || (paramName.toLowerCase() === "load")) {
                if (utils.isTemporalPeriodValid(paramValue)) {
                    if (paramName.toLowerCase() === "acquisition") {
                        qb.andWhere("acquisitionStartDate", ">=", utils.getFromOfTemporalPeriod(paramValue));
                        qb.andWhere("acquisitionEndDate", "<=", utils.getToOfTemporalPeriod(paramValue));
                    } else {
                        qb.andWhere("loadDate", ">=", utils.getFromOfTemporalPeriod(paramValue));
                        qb.andWhere("loadDate", "<=", utils.getToOfTemporalPeriod(paramValue));
                    }
                } else {
                    logger.log.warn("period (%s) not valid for param %s", paramValue, paramName, logMetadata);
                }
            } else {
                qb.andWhere(paramName, "=", paramValue);
            }
        }
        logger.log.debug("filter.queryBuilder: %s", qb, logMetadata);
    }

    function createOrder(qb) {
        if (!sort) {
            return null;
        }
        let sortArray = sort.split(PARAMS_SEPARATOR);
        logger.log.debug("sortArray: %s", sortArray, logMetadata);
        qb.where("idMonitoringFile", ">", 0);
        for (var sortParam in sortArray) {
            let param = sortArray[sortParam].split(PARAM_VALUE_SEPARATOR);
            let paramName = param[0];
            let paramValue = param[1];
            logger.log.debug("sort.param %d: %s=%s", sortParam, paramName, paramValue, logMetadata);
            qb.orderBy(paramName, paramValue);
        }
        logger.log.debug("sort.queryBuilder: %s", qb, logMetadata);
    }


    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFile
            .forge()
            .query(function (qb) {
                createOrder(qb);
                createFilter(qb);
            })
            .fetchPage({
                page: paginate.page,
                pageSize: paginate.per_page,
                withRelated: ["user", "status", "infoStandard.infoStandardName", "region", "arpa", "cnr", "amp", "attachs"]
            })
            .then(function (collection) {
                logger.log.debug("collection: %s", JSON.stringify(collection), logMetadata);
                resolve(collection);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const countMonitoringFiles = function () {
    let logMetadata = MODULE_NAME + "countMonitoringFiles";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFile
            .query()
            .count("idMonitoringFile")
            .then(function (count) {
                logger.log.debug("count: %s", JSON.stringify(count), logMetadata);
                resolve(count);
            }).catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const getMonitoringFile = function (idMonitoringFile) {
    let logMetadata = MODULE_NAME + "getMonitoringFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idMonitoringFile: %s", idMonitoringFile, logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFile
            .forge({
                idMonitoringFile: idMonitoringFile
            })
            .fetch({
                withRelated: ["user", "status", "infoStandard.sheetsMeasure", "infoStandard.sheetStation", "infoStandard.infoStandardName", "region", "arpa", "cnr", "amp", "attachs"]
            })
            .then(function (mf) {
                logger.log.debug("MonitoringFile: %s", JSON.stringify(mf), logMetadata);
                resolve(mf);
            }).catch(function (err) {
                logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const addMonitoringFile = function (input) {
    let logMetadata = MODULE_NAME + "addMonitoringFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: -%s-", JSON.stringify(input), logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFile
            .forge(input)
            .save()
            .then(function (mf) {
                logger.log.debug("idMonitoringFile added: %s", mf.get("idMonitoringFile"), logMetadata);
                resolve(mf);
            }).catch(function (err) {
                logger.log.error("Problem during MonitoringFile add. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

//TODO: MEGA REFACTORING (NON SI PUO' VEDERE)
const updateMonitoringFileAndManageWorkflow = function (input) {
    let logMetadata = MODULE_NAME + "updateMonitoringFileAndManageWorkflow";

    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(input), logMetadata);

    const toReturn = {
        updated: false,
        object: null
    };

    return new Promise(function (resolve, reject) {
        let idMonitoringFile = input.idMonitoringFile;
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            reject("Empty idMonitoringFile");
            return;
        }
        let idStatusNext = input.idFileStatus;
        if (idStatusNext === undefined || idStatusNext === null) {
            //Skip workflow manage and update
            updateMonitoringFile(input)
                .then(function (mf) {
                    logger.log.debug("MonitoringFile updated", logMetadata);
                    toReturn.updated = true;
                    toReturn.object = mf;
                    resolve(toReturn);
                }).catch(function (err) {
                    logger.log.error("Problem during MonitoringFile update. Error: %s", JSON.stringify(err), logMetadata);
                    logger.log.error(err.stack, logMetadata);
                    reject(err);
                });
            return;
        }

        getMonitoringFileStatus(idStatusNext)
            .then(function (nextStatus) {
                logger.log.debug("nextStatus: %s", JSON.stringify(nextStatus), logMetadata);
                getMonitoringFile(idMonitoringFile)
                    .then(function (monitoringFile) {
                        let currentStatus = monitoringFile.related("status");
                        manageWorkflow(idMonitoringFile, currentStatus, nextStatus)
                            .then(function (result) {
                                logger.log.debug("Operation: %s", result.operation, logMetadata);
                                logger.log.debug("operationResult: %s", result.operationResult, logMetadata);
                                logger.log.debug("changeStatus: %s", result.changeStatus, logMetadata);
                                logger.log.debug("next idFileStatus: %d", result.nextIdStatus, logMetadata);

                                if (result.changeStatus) {
                                    logger.log.debug("Update MonitoringFile with (original): %s", JSON.stringify(input), logMetadata);
                                    input.idFileStatus = result.nextIdStatus;
                                    logger.log.debug("Update MonitoringFile with (update): %s", JSON.stringify(input), logMetadata);
                                    updateMonitoringFile(input)
                                        .then(function (mf) {
                                            logger.log.debug("MonitoringFile updated", logMetadata);
                                            getMonitoringFile(idMonitoringFile)
                                                .then(function (mf) {
                                                    toReturn.updated = true;
                                                    toReturn.object = mf;
                                                    resolve(toReturn);
                                                })
                                                .catch(function (err) {
                                                    logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
                                                    logger.log.error(err.stack, logMetadata);
                                                    reject(err);
                                                });
                                        }).catch(function (err) {
                                            logger.log.error("Problem during MonitoringFile update. Error: %s", JSON.stringify(err), logMetadata);
                                            logger.log.error(err.stack, logMetadata);
                                            reject(err);
                                        });
                                } else {
                                    toReturn.updated = false;
                                    toReturn.object = monitoringFile;
                                    resolve(toReturn);
                                }
                            })
                            .catch(function (err) {
                                logger.log.error("Problem during manageWorkflow. Error: %s", JSON.stringify(err), logMetadata);
                                logger.log.error(err.stack, logMetadata);
                                reject(err);
                            });
                    })
                    .catch(function (err) {
                        logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
            })
            .catch(function (err) {
                logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

//TODO: REFACTORING (NON SI PUO' VEDERE)
const manageWorkflow = function (idMonitoringFile, currentStatus, nextStatus) {
    let logMetadata = MODULE_NAME + "manageWorkflow";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idMonitoringFile: %s", idMonitoringFile, logMetadata);

    currentStatus = JSON.parse(JSON.stringify(currentStatus));
    nextStatus = JSON.parse(JSON.stringify(nextStatus));

    logger.log.debug("currentStatus: %s", JSON.stringify(currentStatus), logMetadata);
    logger.log.debug("nextStatus: %s", JSON.stringify(nextStatus), logMetadata);

    const toReturn = {
        operation: "NOP",
        operationResult: true,
        changeStatus: false,
        nextIdStatus: nextStatus.idFileStatus,
        object: null
    };

    return new Promise(function (resolve, reject) {
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            reject("Empty idMonitoringFile");
            return;
        }
        if (currentStatus === undefined || currentStatus === null) {
            reject("Empty currentStatus");
            return;
        }
        if (nextStatus === undefined || nextStatus === null) {
            reject("Empty nextStatus");
            return;
        }

        logger.log.debug("Change status from <%s> --> <%s>", currentStatus.code, nextStatus.code, logMetadata);

        if (currentStatus.idFileStatus === nextStatus.idFileStatus) {
            logger.log.debug("No change status for idMonitoringFile %s", idMonitoringFile, logMetadata);
            toReturn.operation = "NOP";
            toReturn.operationResult = true;
            toReturn.changeStatus = false;
            toReturn.object = null;
            resolve(toReturn);
        } else {
            logger.log.debug("Change status for idMonitoringFile %s", idMonitoringFile, logMetadata);

            //TODO: Implementare un check sulle transizioni di stato, impendendo quelle non previste dal workflow

            switch (nextStatus.code) {
            case configuration.workflowModule.stateCompliant:
                logger.log.debug("nextStatus.code = Compliant: RUN Check compliant rules", logMetadata);
                createInputForValidator(idMonitoringFile)
                    .then(function (inputForValidator) {
                        logger.log.debug("Input objet for validator: %s", JSON.stringify(inputForValidator), logMetadata);
                        validateModuleData.validate(inputForValidator)
                            .then(function (result) {
                                logger.log.debug("Module is valid (compliant) ?", result.valid, logMetadata);
                                toReturn.operation = "COMPLIANT";
                                toReturn.operationResult = result.valid;
                                toReturn.changeStatus = true;
                                if (result.valid === false) {
                                    toReturn.nextIdStatus = configuration.workflowModule.idStateNotCompliant;
                                }
                                toReturn.object = result;
                                resolve(toReturn);
                            })
                            .catch(function (err) {
                                logger.log.error("Problem during validateModuleData. Error: %s", JSON.stringify(err), logMetadata);
                                logger.log.error(err.stack, logMetadata);
                                reject(err);
                            });
                    })
                    .catch(function (err) {
                        logger.log.error("Problem during createInputForValidator. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
                break;
            case configuration.workflowModule.stateValid:
                logger.log.debug("nextStatus.code = Valid: Nothing", logMetadata);
                toReturn.operation = "NOP";
                toReturn.operationResult = true;
                toReturn.changeStatus = true;
                toReturn.object = null;
                resolve(toReturn);
                break;
            case configuration.workflowModule.statePublic:
                logger.log.debug("nextStatus.code = Public: RUN Load data", logMetadata);
                createInputForLoader(idMonitoringFile)
                    .then(function (inputForLoader) {
                        logger.log.debug("Input objet for loader: %s", JSON.stringify(inputForLoader), logMetadata);

                        loadModuleData.load(inputForLoader)
                            .then(function (result) {
                                logger.log.debug("Load data result: %s", result, logMetadata);
                                toReturn.operation = "PUBLISH";
                                toReturn.operationResult = result;
                                toReturn.changeStatus = result;
                                toReturn.object = null;
                                resolve(toReturn);
                            })
                            .catch(function (err) {
                                logger.log.error("Problem during loadModuleData. Error: %s", JSON.stringify(err), logMetadata);
                                logger.log.error(err.stack, logMetadata);
                                reject(err);
                            });
                    })
                    .catch(function (err) {
                        logger.log.error("Problem during createInputForLoader. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
                break;
            default:
                logger.log.debug("Nothing todo", logMetadata);
                toReturn.changeStatus = true;
                toReturn.object = null;
                resolve(toReturn);
            }
        }
    });
};


const createInputForLoader = function (idMonitoringFile) {
    let logMetadata = MODULE_NAME + "createInputForLoader";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idMonitoringFile: %s", idMonitoringFile, logMetadata);

    const toReturn = {
        id: -1,
        path: "",
        sheets: {
            sheetStation: [],
            sheetsMeasure: []
        }
    };

    return new Promise(function (resolve, reject) {
        getMonitoringFile(idMonitoringFile)
            .then(function (monitoringFile) {
                toReturn.id = monitoringFile.get("idMonitoringFile");
                toReturn.path = configuration.docRepo.rootPath + path.sep + monitoringFile.get("fullpath");
                const infoStandard = JSON.parse(JSON.stringify(monitoringFile.related("infoStandard")));
                logger.log.debug("infoStandard: %s", JSON.stringify(infoStandard), logMetadata);
                logger.log.debug("infoStandard.sheetStation: %s", JSON.stringify(infoStandard.sheetStation), logMetadata);
                logger.log.debug("infoStandard.sheetsMeasure: %s", JSON.stringify(infoStandard.sheetsMeasure), logMetadata);

                toReturn.sheets.sheetStation = infoStandard.sheetStation;
                toReturn.sheets.sheetsMeasure = infoStandard.sheetsMeasure;
                logger.log.debug("Input objet for loader: %s", JSON.stringify(toReturn), logMetadata);
                resolve(toReturn);
            })
            .catch(function (err) {
                logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const createInputForValidator = function (idMonitoringFile) {
    let logMetadata = MODULE_NAME + "createInputForValidator";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idMonitoringFile: %s", idMonitoringFile, logMetadata);

    const toReturn = {
        id: -1,
        path: "",
        moduleName: ""
    };

    return new Promise(function (resolve, reject) {
        getMonitoringFile(idMonitoringFile)
            .then(function (monitoringFile) {
                toReturn.id = monitoringFile.get("idMonitoringFile");
                toReturn.path = configuration.docRepo.rootPath + path.sep + monitoringFile.get("fullpath");
                const infoStandard = JSON.parse(JSON.stringify(monitoringFile.related("infoStandard")));
                toReturn.moduleName = infoStandard.infoStandardName.name;
                toReturn.code = monitoringFile.get("code");
                logger.log.debug("Input objet for validator: %s", JSON.stringify(toReturn), logMetadata);
                resolve(toReturn);
            })
            .catch(function (err) {
                logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const updateMonitoringFile = function (input) {
    let logMetadata = MODULE_NAME + "updateMonitoringFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(input), logMetadata);

    return new Promise(function (resolve, reject) {
        let id = input.idMonitoringFile;
        if (id === undefined || id === null) {
            reject("Empty id");
            return;
        }

        repositoryMonitoringFile.MonitoringFile
            .forge({
                idMonitoringFile: id
            })
            .fetch()
            .then(function (mfFetched) {
                logger.log.debug("mf fetched: %s", JSON.stringify(mfFetched), logMetadata);
                mfFetched.save(input, {
                        patch: true
                    })
                    .then(function (mf) {
                        logger.log.debug("mf update: %s", JSON.stringify(mf), logMetadata);
                        resolve(mf);
                    }).catch(function (err) {
                        logger.log.error("Problem during MonitoringFile update. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
            }).catch(function (err) {
                logger.log.error("Problem during MonitoringFile fetch. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const getMonitoringFileStations = function (idMonitoringFile, filter, paginate) {
    let logMetadata = MODULE_NAME + "getMonitoringFileStations";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("idMonitoringFile: %s", idMonitoringFile, logMetadata);

    return getMonitoringFile(idMonitoringFile)
        .then(monitoringFile => getStations(monitoringFile, filter, paginate))
        .catch(function (err) {
            logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
            logger.log.error(err.stack, logMetadata);
        });
};

const getMonitoringFileStation = function (idMonitoringFile, idMonitoring) {
    let logMetadata = MODULE_NAME + "getMonitoringFileStation";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("idMonitoringFile: %s", idMonitoringFile, logMetadata);
    logger.log.debug("idMonitoring: %s", idMonitoring, logMetadata);

    return getMonitoringFile(idMonitoringFile)
        .then(monitoringFile => getStation(monitoringFile, idMonitoring))
        .catch(function (err) {
            logger.log.error("Problem during MonitoringFile read. Error: %s", JSON.stringify(err), logMetadata);
            logger.log.error(err.stack, logMetadata);
        });
};

const getMonitoringFileStationMeasures = function (idMonitoring, tableName, hidecolumns) {
    let logMetadata = MODULE_NAME + "getMonitoringFileStationMeasures";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("idMonitoring: %d", idMonitoring, logMetadata);
    logger.log.debug("tableName: %s", tableName, logMetadata);



    return new Promise(function (resolve, reject) {
        // IMPORTANT: this code too tied the Database
        // TODO: refactoring is necessary

        bookshelf.bookshelf.knex("information_schema.columns")
            .select("column_name")
            .where({
                table_name: tableName
            })
            .then(function (collection) {
                logger.log.debug("collection: %s", JSON.stringify(collection), logMetadata);

                var columnsToHide = hidecolumns.split(","); //["id", "idMonitoring", "NationalStationID"];
                var columnsToShow = [];

                for (var i = 0; i < collection.length; i++) {
                    var obj = collection[i];
                    if (columnsToHide.indexOf(obj["column_name"]) != -1) {
                        logger.log.debug("obj to hide: %s", JSON.stringify(obj), logMetadata);
                    } else {
                        logger.log.debug("obj to show: %s", JSON.stringify(obj), logMetadata);
                        columnsToShow.push(obj["column_name"]);
                    }
                }
                logger.log.debug("columnsToShow: %s", JSON.stringify(columnsToShow), logMetadata);

                        bookshelf.bookshelf.knex(tableName)
                            //.select("*")
                            .select(columnsToShow)
                            .where({
                                idMonitoring: idMonitoring
                            })
                            .then(function (collection) {
                                logger.log.debug("collection count: %s", collection.length, logMetadata);
                                resolve(collection);
                            })
                            .catch(function (err) {
                                logger.log.error(err, logMetadata);
                                logger.log.error(err.stack, logMetadata);
                                reject(err);
                            });

            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });


    /*
        return new Promise(function (resolve, reject) {
            bookshelf.bookshelf.knex(tableName)
                .select("*")
                .where({
                    idMonitoring: idMonitoring
                })
                .then(function (collection) {
                    logger.log.debug("collection count: %s", collection.length, logMetadata);
                    resolve(collection);
                })
                .catch(function (err) {
                    logger.log.error(err, logMetadata);
                    logger.log.error(err.stack, logMetadata);
                    reject(err);
                });
        });
    */
};

const getStations = function (monitoringFile, filter, paginate) {
    let logMetadata = MODULE_NAME + "getStations";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("MonitoringFile: %s", JSON.stringify(monitoringFile), logMetadata);

    let idMonitoringFile = JSON.parse(JSON.stringify(monitoringFile)).idMonitoringFile;
    logger.log.debug("MonitoringFile.name: %s", JSON.parse(JSON.stringify(monitoringFile)).name, logMetadata);
    logger.log.debug("idMonitoringFile: %s", JSON.parse(JSON.stringify(monitoringFile)).idMonitoringFile, logMetadata);

    let infoStandardName = JSON.parse(JSON.stringify(monitoringFile)).infoStandard.infoStandardName.name;
    logger.log.debug("Cod. InfoStandardName: %s", infoStandardName, logMetadata);

    let tableName = JSON.parse(JSON.stringify(monitoringFile)).infoStandard.sheetStation[0].pgTableName;
    logger.log.debug("tableName for station: %s", tableName, logMetadata);

    return new Promise(function (resolve, reject) {
        bookshelf.bookshelf.knex(tableName)
            .select("*")
            .where({
                idMonitoringFile: idMonitoringFile
            })
            .then(function (collection) {
                logger.log.debug("collection count: %s", collection.length, logMetadata);
                resolve(collection);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });

    //
    //
    //
    // let repoStation = getRepoStation(infoStandardName);
    // return new Promise(function(resolve, reject) {
    //     repoStation
    //         .forge({
    //             idMonitoringFile: idMonitoringFile
    //         })
    //         .orderBy("NationalStationName", "ASC")
    //         //.fetch()
    //         .fetchPage({
    //             page: paginate.page,
    //             pageSize: paginate.per_page
    //         })
    //         .then(function(collection) {
    //             logger.log.debug("collection: %s", JSON.stringify(collection), logMetadata);
    //             resolve(collection);
    //         })
    //         .catch(function(err) {
    //             logger.log.error(err, logMetadata);
    //             logger.log.error(err.stack, logMetadata);
    //             reject(err);
    //         });
    // });
};

const getStation = function (monitoringFile, idMonitoring) {
    let logMetadata = MODULE_NAME + "getStation";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("MonitoringFile: %s", JSON.stringify(monitoringFile), logMetadata);

    let idMonitoringFile = JSON.parse(JSON.stringify(monitoringFile)).idMonitoringFile;
    logger.log.debug("MonitoringFile.name: %s", JSON.parse(JSON.stringify(monitoringFile)).name, logMetadata);
    logger.log.debug("idMonitoringFile: %s", JSON.parse(JSON.stringify(monitoringFile)).idMonitoringFile, logMetadata);

    let infoStandardName = JSON.parse(JSON.stringify(monitoringFile)).infoStandard.infoStandardName.name;
    logger.log.debug("Cod. InfoStandardName: %s", infoStandardName, logMetadata);

    let tableName = JSON.parse(JSON.stringify(monitoringFile)).infoStandard.sheetStation[0].pgTableName;
    logger.log.debug("tableName for station: %s", tableName, logMetadata);

    return new Promise(function (resolve, reject) {
        bookshelf.bookshelf.knex(tableName)
            .select("*")
            .where({
                idMonitoring: idMonitoring
            })
            .then(function (station) {
                logger.log.debug("station: %s", JSON.stringify(station), logMetadata);
                resolve(station);
            }).catch(function (err) {
                logger.log.error("Problem during station read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const getMonitoringFileAttachs = function () {
    let logMetadata = MODULE_NAME + "getMonitoringFileAttachs";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFileAttach
            .forge()
            .query(function queryBuilder(qb) {
                qb.orderBy("name", "asc");
            })
            .fetchAll()
            .then(function (collection) {
                logger.log.debug("MonitoringFileAttach collection: %s", JSON.stringify(collection.toJSON()));
                resolve(collection);
            }).catch(function (err) {
                logger.log.debug(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const getMonitoringFileAttach = function (idMfAttachment) {
    let logMetadata = MODULE_NAME + "getMonitoringFileAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idMfAttachment: %s", idMfAttachment, logMetadata);

    return new Promise(function (resolve, reject) {
        repositoryMonitoringFile.MonitoringFileAttach
            .forge({
                idMfAttachment: idMfAttachment
            })
            .fetch()
            .then(function (mfAttach) {
                logger.log.debug("MonitoringFileAttach: %s", JSON.stringify(mfAttach), logMetadata);
                resolve(mfAttach);
            }).catch(function (err) {
                logger.log.error("Problem during MonitoringFileAttach read. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const addMonitoringFileAttach = function (params) {
    let logMetadata = MODULE_NAME + "addMonitoringFileAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(params), logMetadata);

    let idMonitoringFile = params.idMonitoringFile;
    logger.log.debug("idMonitoringFile: %d", idMonitoringFile, logMetadata);

    return new Promise(function (resolve, reject) {
        logger.log.debug("idMonitoringFile = %s", params.idMonitoringFile, logMetadata);
        new repositoryMonitoringFile.MonitoringFileAttach(params)
            .save()
            .then(function (attachSaved) {
                logger.log.debug("attach added: %d", attachSaved.idMfAttachment, logMetadata);
                resolve(attachSaved);
            }).catch(function (err) {
                logger.log.error("Problem during creation attach: %s. Error: %s", params, err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const updateMonitoringFileAttach = function (params) {
    let logMetadata = MODULE_NAME + "addMonitoringFileAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(params), logMetadata);

    return new Promise(function (resolve, reject) {
        let idMfAttachment = params.idMfAttachment;
        logger.log.debug("idMfAttachment = %s", idMfAttachment, logMetadata);

        repositoryMonitoringFile.MonitoringFileAttach
            .forge({
                idMfAttachment: idMfAttachment
            })
            .fetch()
            .then(function (attachFetched) {
                logger.log.debug("Attach fetched: %s", JSON.stringify(attachFetched), logMetadata);
                attachFetched.save(params, {
                        patch: true
                    })
                    .then(function (attach) {
                        logger.log.debug("attach update: %s", JSON.stringify(attach), logMetadata);
                        resolve(attach);
                    }).catch(function (err) {
                        logger.log.error("Problem during attach update. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
            }).catch(function (err) {
                logger.log.error("Problem during attach fetch. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

const removeMonitoringFileAttach = function (idMfAttachment) {
    let logMetadata = MODULE_NAME + "removeMonitoringFileAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idMfAttachment: %d", idMfAttachment, logMetadata);

    return new Promise(function (resolve, reject) {
        new repositoryMonitoringFile.MonitoringFileAttach({
                idMfAttachment: idMfAttachment
            })
            .destroy()
            .then(function () {
                logger.log.debug("Attach removed from MonitoringFile", logMetadata);
                resolve("Attach removed from MonitoringFile");
            }).catch(function (err) {
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
};

// Public
const pub = {
    getMonitoringFileStatuss: getMonitoringFileStatuss,
    getMonitoringFiles: getMonitoringFiles,
    getMonitoringFile: getMonitoringFile,
    addMonitoringFile: addMonitoringFile,
    updateMonitoringFile: updateMonitoringFile,
    updateMonitoringFileAndManageWorkflow: updateMonitoringFileAndManageWorkflow,
    countMonitoringFiles: countMonitoringFiles,
    getMonitoringFileAttachs: getMonitoringFileAttachs,
    getMonitoringFileAttach: getMonitoringFileAttach,
    addMonitoringFileAttach: addMonitoringFileAttach,
    updateMonitoringFileAttach: updateMonitoringFileAttach,
    removeMonitoringFileAttach: removeMonitoringFileAttach,
    getMonitoringFileStations: getMonitoringFileStations,
    getMonitoringFileStation: getMonitoringFileStation,
    getMonitoringFileStationMeasures: getMonitoringFileStationMeasures,
};


module.exports = pub;