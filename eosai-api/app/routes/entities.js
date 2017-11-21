"use strict";
let routes = function(server) {
    let confRoutes = require("./config.js");
    let restify = require('restify');
    let logger = require("../utils/log.js");
    let chalk = require('chalk');

    let service = require('../services/service');

    let logMetadata = {
        module: "routes.entities",
        method: ""
    };


    /**
     * @api {get} /entities/orgtypes GetOrgTypes
     * @apiVersion 1.0.0
     * @apiName GetOrgTypes
     * @apiGroup Entity
     * @apiDescription List of Organization Types
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/orgtypes"
     *
     */
    server.get({
        path: '/entities/orgtypes',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "getOrgTypes";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        service.EntityService.getOrgTypes()
            .then(function(collection) {
                logger.log.debug("OrgTypes collection: %s", JSON.stringify(collection.toJSON()), logMetadata);
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });


    /**
     * @api {get} /entities/regions GetRegions
     * @apiVersion 1.0.0
     * @apiName GetRegions
     * @apiGroup Entity
     * @apiDescription List of region
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/regions"
     *
     * @apiSuccess {Json[]} json array of Json object
     * @apiSuccess {Number} json.idregion
     * @apiSuccess {String} json.code
     * @apiSuccess {String} json.name
     *
     * @apiSuccessExample  Success-response:
     * HTTP/1.1 200 OK
     * Content-Type: application/json
     * Content-Length: 143
     * Date: Fri, 12 Feb 2016 02:03:38 GMT
     * Connection: keep-alive
     *
     * [{"idregion":1,"code":"ABRU","name":"Abruzzo"},{"idregion":2,"code":"BASI","name":"Basilicata"},{"idregion":3,"code":"CALA","name":"Calabria"}]
     *
     */
    server.get({
        path: '/entities/regions',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetRegions";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        service.EntityService.getRegions()
            .then(function(collection) {
                logger.log.debug("Regions collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });


    /**
     * @api {get} /entities/regions/:idRegion/users GetRegionUsers
     * @apiVersion 1.0.0
     * @apiName GetRegionUsers
     * @apiGroup Entity
     * @apiDescription List of users for region
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/regions/1/users"
     */
    server.get({
        path: '/entities/regions/:idRegion/users',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetRegionUsers";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idRegion = req.params.idRegion;
        if (idRegion == undefined || idRegion == null) {
            idRegion = "";
        }
        logger.log.debug("'/entities/regions/%s/users", idRegion);

        service.UserService.getUsersForRegion(idRegion)
            .then(function(collection) {
                logger.log.debug("Users collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });


    /**
     * @api {get} /entities/arpas GetArpas
     * @apiVersion 1.0.0
     * @apiName GetArpas
     * @apiGroup Entity
     * @apiDescription List of arpas
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/arpas"
     *
     * @apiSuccess {Json[]} json array of Json object
     * @apiSuccess {Number} json.idarpa
     * @apiSuccess {String} json.code
     * @apiSuccess {String} json.name
     *
     * @apiSuccessExample  Success-response:
     * HTTP/1.1 200 OK
     * Content-Type: application/json
     * Content-Length: 165
     * Date: Fri, 12 Feb 2016 02:03:38 GMT
     * Connection: keep-alive
     *
     * [{"idarpa":3,"code":"ARPA-CA","name":"ARPA Calabria"},{"idarpa":1,"code":"ARPA-ER","name":"ARPA Emilia-Romagna"},{"idarpa":2,"code":"ARPA-LI","name":"ARPA Liguria"}]
     *
     */
    server.get({
        path: '/entities/arpas',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetArpas";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        service.EntityService.getArpas()
            .then(function(collection) {
                logger.log.debug("Arpas collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });



    /**
     * @api {get} /entities/cnrs GetCnrs
     * @apiVersion 1.0.0
     * @apiName GetCnrs
     * @apiGroup Entity
     * @apiDescription List of cnr
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/cnrs"
     *
     *
     * @apiSuccess {Json[]} json array of Json object
     * @apiSuccess {Number} json.idcnr
     * @apiSuccess {String} json.code
     * @apiSuccess {String} json.name
     *
     */
    server.get({
        path: '/entities/cnrs',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetCnrs";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        service.EntityService.getCnrs()
            .then(function(collection) {
                logger.log.debug("Cnrs collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });


    /**
     * @api {get} /entities/cnrs/:idCnr/users GetCnrUsers
     * @apiVersion 1.0.0
     * @apiName GetCnrUsers
     * @apiGroup Entity
     * @apiDescription List of users for cnr
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/cnr/1/users"
     */
    server.get({
        path: '/entities/cnrs/:idCnr/users',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetCnrUsers";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idCnr = req.params.idCnr;
        if (idCnr == undefined || idCnr == null) {
            idCnr = "";
        }
        logger.log.debug("idCnr: %s", idCnr, logMetadata);

        service.UserService.getUsersForCnr(idCnr)
            .then(function(collection) {
                logger.log.debug("Users collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });

    /**
     * @api {get} /entities/amps/:idAmp/users GetAmpUsers
     * @apiVersion 1.0.0
     * @apiName GetAmpUsers
     * @apiGroup Entity
     * @apiDescription List of users for amp
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/amp/1/users"
     */
    server.get({
        path: '/entities/amps/:idAmp/users',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetAmpUsers";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idAmp = req.params.idAmp;
        if (idAmp == undefined || idAmp == null) {
            idAmp = "";
        }
        logger.log.debug("idAmp: %s", idAmp, logMetadata);

        service.UserService.getUsersForAmp(idAmp)
            .then(function(collection) {
                logger.log.debug("Users collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });

    /**
     * @api {get} /entities/amps GetAmps
     * @apiVersion 1.0.0
     * @apiName GetAmps
     * @apiGroup Entity
     * @apiDescription List of Amp
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET http://localhost:8081/api/v1/entities/amps"
     *
     *
     * @apiSuccess {Json[]} json array of Json object
     * @apiSuccess {Number} json.idamp
     * @apiSuccess {String} json.code
     * @apiSuccess {String} json.name
     *
     */
    server.get({
        path: '/entities/amps',
        version: confRoutes.VERSION_1_0_0
    }, function(req, res, next) {
        logMetadata.method = "GetAmps";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        service.EntityService.getAmps()
            .then(function(collection) {
                logger.log.debug("Amps collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
        next();
    });

}


module.exports = routes;
