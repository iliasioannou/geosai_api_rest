"use strict";
const routes = function(server) {
    const confRoutes = require("./config");
    const namespace = require("restify-namespace");
    const serviceMonitoringFile = require("../services/monitoringFile");
    const restify = require("restify");
    const logger = require("../utils/log");
    const chalk = require("chalk");
    const moment = require("moment");

    const logMetadata = {
        module: "routes.monitoringFileStatus",
        method: ""
    };

    const PATH = "/monfilestatus";
    namespace(server, PATH, function() {
        /**
         * @api {get} /monfilestatus GetMonitoringFileStatus
         * @apiVersion 1.0.0
         * @apiName GetMonitoringFileStatus
         * @apiGroup MonitoringFile
         * @apiDescription List of MonitoringFile status
         *
         * @apiExample {curl} Example usage:
         * 	curl -X GET http://localhost:8081/api/v1/monfilesstatus"
         */
        server.get({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, getMonitoringFileStatus);
    });

    function getMonitoringFileStatus(req, res, next) {
        logMetadata.method = "getMonitoringFileStatus";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        serviceMonitoringFile.getMonitoringFileStatuss()
            .then(function(collection) {
                logger.log.debug("MonitoringFileStatuss collection: %s", JSON.stringify(collection.toJSON()), logMetadata);
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during Get MonitoringFileStatuss list."));
            });
    };

}

module.exports = routes;
