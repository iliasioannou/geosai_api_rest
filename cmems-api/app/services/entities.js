"use strict";
let repository = require('../repositories/entities.js');
let logger = require("../utils/log.js");
let chalk = require('chalk');

let logMetadata = {
    module: "services.enties",
    method: ""
};


/**
 * Return list of organization types
 */

let getOrgTypes = function() {
    logMetadata.method = "getOrgTypes";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.OrgType.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("orgtype", "asc");
        })
        .fetchAll();
}

/**
 * Return list of Region
 */
let getRegions = function() {
    logMetadata.method = "getRegions";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Region.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}


/**
 * Return list of Arpa
 */
let getArpas = function() {
    logMetadata.method = "getArpas";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Arpa.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}

/**
 * Return list of Amp
 */
let getAmps = function() {
    logMetadata.method = "getAmps";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Amp.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}

/**
 * Return list of Cnr
 */
let getCnrs = function() {
    logMetadata.method = "getCnrs";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Cnr.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}




// Public
let pub = {
    getOrgTypes: getOrgTypes,
    getRegions: getRegions,
    getArpas: getArpas,
    getAmps: getAmps,
    getCnrs: getCnrs
}

module.exports = pub
