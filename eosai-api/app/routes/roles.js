"use strict";
const routes = function(server) {
    const confRoutes = require("./config.js");
    const serviceRoles = require('../services/roles.js');
    const restify = require('restify');
    const logger = require("../utils/log.js");
    const chalk = require('chalk');

    const logMetadata = {
        module: "routes.roles",
        method: ""
    };

    /**
     * @api {get} /roles GetRoles
     * @apiVersion 1.0.0
     * @apiName GetRoles
     * @apiGroup Role
     * @apiDescription Roles's list
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/roles"
     *
     */
    server.get({
        path: "/roles",
        version: confRoutes.VERSION
    }, function(req, res, next) {
        logMetadata.method = "roles";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        serviceRoles.getRoles()
            .then(function(collection) {
                logger.log.debug("Roles collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error, logMetadata);
            });
        next();
    });


    /**
     * @api {get} /roles/:idRole GetRole
     * @apiVersion 1.0.0
     * @apiName GetRole
     * @apiGroup Role
     * @apiDescription Role details with relative privileges
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/roles/1
     */
    server.get({
        path: "/roles/:idRole",
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "getRole";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idRole = req.params.idRole;
        if (idRole == undefined || idRole == null) {
            idRole = "";
        }
        logger.log.debug("idRole: %s", idRole, logMetadata);

        serviceRoles.getRole(idRole)
            .then(function(role) {
                if (role) {
                    logger.log.debug("Role : %s", JSON.stringify(role.toJSON()), logMetadata);
                    res.send(role.toJSON());
                }
                else {
                    next(new restify.NotFoundError("Unknow role. Sorry !"));
                }
            })
            .catch(function(error) {
                logger.log.debug(error, logMetadata);
            });
    });

}

module.exports = routes;
