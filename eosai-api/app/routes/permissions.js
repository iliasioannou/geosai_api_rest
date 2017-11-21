"use strict";
const routes = function(server) {
    const confRoutes = require("./config.js");
    const servicePermissions = require('../services/permissions.js');
    const restify = require('restify');
    const logger = require("../utils/log.js");
    const chalk = require('chalk');

    const logMetadata = {
        module: "routes.permissions",
        method: ""
    };

    /**
     * @api {get} /permissions getPermissions
     * @apiVersion 1.0.0
     * @apiName getPermissions
     * @apiGroup Permission
     * @apiDescription Permission's list
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/permissions
     *
     */
    server.get({
        path: '/permissions',
        version: confRoutes.VERSION
    }, function(req, res, next) {
        logMetadata.method = "roles";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        servicePermissions.getPermissions()
            .then(function(collection) {
                logger.log.debug("Permissions collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });

}

module.exports = routes;
