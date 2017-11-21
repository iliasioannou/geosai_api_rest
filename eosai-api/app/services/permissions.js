"use strict";
let repository = require('../repositories/permissions.js');
let logger = require("../utils/log.js");
let chalk = require('chalk');

let logMetadata = {
    module: "services.permissions",
    method: ""
};

let getPermissions = function() {
    logMetadata.method = "getPermissions";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repository.Permission
        .forge()
        .fetchAll({
            withRelated: ["role", "privilege"]
        });
}


// Public
let pub = {
    getPermissions: getPermissions
}

module.exports = pub;
