"use strict";
let repository = require('../repositories/roles');
let logger = require("../utils/log.js");
let chalk = require('chalk');

let logMetadata = {
    module: "services.roles",
    method: ""
};

let getRoles = function() {
    logMetadata.method = "getRoles";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Role.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        //.fetchAll();
        .fetchAll({
            withRelated: ["privileges"]
        });
}

let getRole = function(idRole) {
    logMetadata.method = "getRole";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Role.forge({
            idRole: idRole
        })
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetch({
            withRelated: ["privileges"]
        });
}

// Public
let pub = {
    getRole: getRole,
    getRoles: getRoles
}

module.exports = pub;
