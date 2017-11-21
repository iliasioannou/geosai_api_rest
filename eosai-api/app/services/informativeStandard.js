"use strict";
let repository = require('../repositories/informativeStandard');
let lodash = require("lodash");

let logger = require("../utils/log");
let chalk = require("chalk");
let logMetadata = {
    module: "services.informativeStandard",
    method: ""
};

let getInfoStandardNames = function() {
    logMetadata.method = "getInfoStandardNames";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return new Promise(function(resolve, reject) {
        repository.InfoStandardName
            .forge()
            .query(function queryBuilder(qb) {
                qb.orderBy("name", "asc");
            })
            .fetchAll({
                withRelated: ["infoStandards"]
            })
            .then(function(collection) {
                logger.log.debug("InfoStandardNames collection: %s", JSON.stringify(collection.toJSON()), logMetadata);
                resolve(collection);
            }).catch(function(err) {
                logger.log.debug(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let getInfoStandardName = function(idInfStandardName) {
    logMetadata.method = "getInfoStandardName";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("idInfStandardName: %s", idInfStandardName, logMetadata);

    return new Promise(function(resolve, reject) {
        repository.InfoStandardName
            .forge({
                idInfStandardName: idInfStandardName
            })
            .fetch({
                withRelated: ["infoStandards"]
            })
            .then(function(infoStandardName) {
                logger.log.debug("infoStandardName: %s", JSON.stringify(infoStandardName), logMetadata);
                resolve(infoStandardName);
            }).catch(function(err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let addInfoStandardName = function(infoStandardNameParams) {
    logMetadata.method = "addInfoStandardName";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: -%s-", JSON.stringify(infoStandardNameParams), logMetadata);

    return new Promise(function(resolve, reject) {
        new repository.InfoStandardName(infoStandardNameParams)
            .save()
            .then(function(infoStandardName) {
                logger.log.debug("InfoStandardName added: %d", infoStandardName.idInfStandardName, logMetadata);
                resolve(infoStandardName);
            }).catch(function(err) {
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let updateInfoStandardName = function(infoStandardNameParams) {
    logMetadata.method = "updateInfoStandardName";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(infoStandardNameParams), logMetadata);

    return new Promise(function(resolve, reject) {
        let idInfStandardName = infoStandardNameParams.idInfStandardName;
        if (idInfStandardName == undefined || idInfStandardName == null) {
            reject("Empty idInfStandardName");
            return;
        };

        repository.InfoStandardName
            .forge({
                idInfStandardName: idInfStandardName
            })
            .fetch()
            .then(function(infoStandardNameFetched) {
                logger.log.debug("infoStandardName fetched: %s", JSON.stringify(infoStandardNameFetched), logMetadata);
                infoStandardNameFetched.save(infoStandardNameParams, {
                        patch: true
                    })
                    .then(function(infoStandardName) {
                        logger.log.debug("infoStandardName update: %s", JSON.stringify(infoStandardName), logMetadata);
                        resolve(infoStandardName);
                    }).catch(function(err) {
                        logger.log.error("Problem during user update. Error: %s", JSON.stringify(err), logMetadata);
                        reject(err);
                    });
            }).catch(function(err) {
                logger.log.error("Problem during user fetch. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let getInfoStandardsVersionAll = function(idInfStandardName) {
    logMetadata.method = "getInfoStandardsVersionAll";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("idInfStandardName: %s", idInfStandardName, logMetadata);

    return new Promise(function(resolve, reject) {
        repository.InfoStandardName
            .forge({
                idInfStandardName: idInfStandardName
            })
            .infoStandards()
            .query("orderBy", "version", "desc")
            .fetch({
                withRelated: ["sheetStation", "sheetsMeasure", "attachs"],
                require: true
            })
            //.orderBy("version", "DESC")
            .then(function(collection) {
                logger.log.debug("collection: %s", JSON.stringify(collection), logMetadata);
                resolve(collection);
            }).catch(function(err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let getInfoStandardsVersionLast = function(idInfStandardName) {
    logMetadata.method = "getInfoStandardsVersionLast";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idInfStandardName: %s", idInfStandardName, logMetadata);

    return new Promise(function(resolve, reject) {
        getInfoStandardsVersionAll(idInfStandardName)
            .then(function(collection) {
                logger.log.debug("collection : %s", JSON.stringify(collection), logMetadata);
                if (collection) {
                    resolve(collection.head());
                }
                else {
                    logger.log.warng("collection empty for idInfStandardName: %s", idInfStandardName, logMetadata);
                    reject("collection empty");
                }
            })
            .catch(function(err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let getInfoStandards = function(idInfStandardName, last) {
    logMetadata.method = "getInfoStandards";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idInfStandardName: -%s-, last: -%s-", idInfStandardName, last, logMetadata);

    if (last === "true") {
        return getInfoStandardsVersionLast(idInfStandardName)
    }
    else {
        return getInfoStandardsVersionAll(idInfStandardName);
    }
}

let getInfoStandard = function(idInfStandard) {
    logMetadata.method = "getInfoStandard";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    logger.log.debug("idInfStandard: %s", idInfStandard, logMetadata);

    return new Promise(function(resolve, reject) {
        repository.InfoStandard
            .forge({
                idInformativeStandard: idInfStandard
            })
            .fetch({
                withRelated: ["sheetStation", "sheetsMeasure", "attachs"]
            })
            .then(function(infoStandard) {
                logger.log.debug("infoStandard: %s", JSON.stringify(infoStandard), logMetadata);
                resolve(infoStandard);
            }).catch(function(err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let addInfoStandard = function(infoStandardParams) {
    logMetadata.method = "addInfoStandard";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(infoStandardParams), logMetadata);

    return new Promise(function(resolve, reject) {
        logger.log.debug("idInfStandardName = %s", infoStandardParams.idInfStandardName, logMetadata);
        getInfoStandardsVersionLast(infoStandardParams.idInfStandardName)
            .then(function(infoStandardVersionLast) {
                logger.log.debug("infoStandardVersionLast retrieved : %s", JSON.stringify(infoStandardVersionLast.toJSON()), logMetadata);
                logger.log.debug("Last version : %s", infoStandardVersionLast.toJSON().version, logMetadata);
                infoStandardParams.version = infoStandardVersionLast.toJSON().version + 1;
                logger.log.debug("input: %s", JSON.stringify(infoStandardParams), logMetadata);

                // repository.InfoStandard
                // .create(infoStandardParams)
                new repository.InfoStandard(infoStandardParams)
                    .save()
                    .then(function(infoStandardSaved) {
                        logger.log.debug("infoStandard added: %d", infoStandardSaved.idInformativeStandard, logMetadata);
                        resolve(infoStandardSaved);
                    }).catch(function(err) {
                        logger.log.error("Problem during creation InfoStandard: %s. Error: %s", infoStandardParams, error, logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
            })
            .catch(function(error) {
                logger.log.error("Problem during retrieve last version for InfoStandard: %s. Error: %s", infoStandardParams, error, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let updateInfoStandard = function(infoStandardParams) {
    logMetadata.method = "updateInfoStandard";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(infoStandardParams), logMetadata);

    return new Promise(function(resolve, reject) {
        let idInformativeStandard = infoStandardParams.idInformativeStandard;
        logger.log.debug("idInformativeStandard = %s", idInformativeStandard, logMetadata);
        // delete infoStandardParams.idInformativeStandard;
        // logger.log.debug("input: %s", JSON.stringify(infoStandardParams), logMetadata);
        // repository.InfoStandard
        //     .update(infoStandardParams, {
        //         id: idInformativeStandard
        //     })

        repository.InfoStandard
            .forge({
                idInformativeStandard: idInformativeStandard
            })
            .fetch()
            .then(function(infoStandardFetched) {
                logger.log.debug("infoStandard fetched: %s", JSON.stringify(infoStandardFetched), logMetadata);
                infoStandardFetched.save(infoStandardParams, {
                        patch: true
                    })
                    .then(function(infoStandard) {
                        logger.log.debug("infoStandard update: %s", JSON.stringify(infoStandard), logMetadata);
                        resolve(infoStandard);
                    }).catch(function(err) {
                        logger.log.error("Problem during infoStandard update. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        eject(err);
                    });
            }).catch(function(err) {
                logger.log.error("Problem during infoStandard fetch. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let addInfoStandardAttach = function(params) {
    logMetadata.method = "addInfoStandardAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(params), logMetadata);

    return new Promise(function(resolve, reject) {
        logger.log.debug("idInfStandard = %s", params.idInfStandard, logMetadata);
        new repository.InfoStandardAttach(params)
            .save()
            .then(function(attachSaved) {
                logger.log.debug("attach added: %d", attachSaved.idIsAttachment, logMetadata);
                resolve(attachSaved);
            }).catch(function(err) {
                logger.log.error("Problem during creation attach: %s. Error: %s", params, err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let updateInfoStandardAttach = function(params) {
    logMetadata.method = "updateInfoStandardAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(params), logMetadata);

    return new Promise(function(resolve, reject) {
        let idIsAttachment = params.idIsAttachment;
        logger.log.debug("idIsAttachment = %s", idIsAttachment, logMetadata);

        repository.InfoStandardAttach
            .forge({
                idIsAttachment: idIsAttachment
            })
            .fetch()
            .then(function(attachFetched) {
                logger.log.debug("Attach fetched: %s", JSON.stringify(attachFetched), logMetadata);
                attachFetched.save(params, {
                        patch: true
                    })
                    .then(function(attach) {
                        logger.log.debug("attach update: %s", JSON.stringify(attach), logMetadata);
                        resolve(attach);
                    }).catch(function(err) {
                        logger.log.error("Problem during attach update. Error: %s", JSON.stringify(err), logMetadata);
                        logger.log.error(err.stack, logMetadata);
                        reject(err);
                    });
            }).catch(function(err) {
                logger.log.error("Problem during attach fetch. Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

let removeInfoStandardAttach = function(idIsAttachment) {
    logMetadata.method = "deleteInfoStandardAttach";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idIsAttachment: %d", idIsAttachment, logMetadata);

    return new Promise(function(resolve, reject) {
        new repository.InfoStandardAttach({
                idIsAttachment: idIsAttachment
            })
            .destroy()
            .then(function() {
                logger.log.debug("Attach removed from informativeStandard", logMetadata);
                resolve("Attach removed from informativeStandard");
            }).catch(function(err) {
                logger.log.error(err.stack, logMetadata);
                reject(err);
            });
    });
}

// Public
let pub = {
    getInfoStandardNames: getInfoStandardNames,
    getInfoStandardName: getInfoStandardName,
    addInfoStandardName: addInfoStandardName,
    updateInfoStandardName: updateInfoStandardName,
    getInfoStandards: getInfoStandards,
    getInfoStandard: getInfoStandard,
    addInfoStandard: addInfoStandard,
    updateInfoStandard: updateInfoStandard,
    addInfoStandardAttach: addInfoStandardAttach,
    updateInfoStandardAttach: updateInfoStandardAttach,
    removeInfoStandardAttach: removeInfoStandardAttach
}


module.exports = pub
module.exports = pub
