"use strict";
let repository = require('../repositories/privileges.js');
let logger = require("../utils/log.js");
let chalk = require('chalk');

let logMetadata = {
    module: "services.privileges",
    method: ""
};

let getPrivileges = function() {
    logMetadata.method = "getPrivileges";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Privilege.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}


// Public
let pub = {
    getPrivileges: getPrivileges
}

module.exports = pub;
