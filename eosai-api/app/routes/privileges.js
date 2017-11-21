"use strict";
const routes = function(server) {
    const confRoutes = require("./config.js");
    const servicePrivileges = require('../services/privileges.js');
    const restify = require('restify');
    const logger = require("../utils/log.js");
    const chalk = require('chalk');

    const logMetadata = {
        module: "routes.privileges",
        method: ""
    };

    /**
     * @api {get} /privileges GetPrivileges
     * @apiVersion 1.0.0
     * @apiName GetPrivileges
     * @apiGroup Privilege
     * @apiDescription list of privileges items
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/privileges"
     *
     * @apiSuccess {Json[]} json array of Json object
     * @apiSuccess {Number} json.idprivilege
     * @apiSuccess {String} json.name
     *
     * @apiSuccessExample  Success-response:
     * HTTP/1.1 200 OK
     * Content-Type: application/json
     * Content-Length: 143
     * Date: Fri, 12 Feb 2016 02:03:38 GMT
     * Connection: keep-alive
     *
     * [{"idprivilege":1,"name":"Manage users"},{"idprivilege":2,"name":"Manage informatives standard}]
     *
     */
    server.get({
        path: '/privileges',
        version: confRoutes.VERSION
    }, function(req, res, next) {
        logMetadata.method = "privileges";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        servicePrivileges.getPrivileges()
            .then(function(collection) {
                logger.log.debug("Provileges collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });

}

module.exports = routes;
