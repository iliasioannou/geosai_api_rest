"use strict";
const routes = function(server) {
    const confRoutes = require("./config");
    const namespace = require("restify-namespace");
    const serviceInformativeStandard = require('../services/informativeStandard');
    const restify = require('restify');
    const logger = require("../utils/log");
    const chalk = require('chalk');

    const logMetadata = {
        module: "routes.informativeStandard",
        method: ""
    };

    namespace(server, "/infostds", function() {

        /**
         * @api {get} /infostds GetInfoStandardNames
         * @apiVersion 1.0.0
         * @apiName GetInfoStandardNames
         * @apiGroup InfoStandard
         * @apiDescription InfoStandardName's list
         *
         * @apiExample {curl} Example usage:
         * 	curl -X GET http://localhost:8081/api/v1/infostds"
         *
         */
        server.get({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, GetInfoStandardNames);

        /**
         * @api {post} /infostds AddInfoStandardName
         * @apiVersion 1.0.0
         * @apiName AddInfoStandardName
         * @apiGroup InfoStandard
         * @apiDescription Add InfoStandardName
         *
         * @apiExample {curl} Example usage:
         *    curl -H "Content-Type: application/json" -X POST -d '{"name": "Test-Name", "description": "Test description", "active": 1}}' http://localhost:3000/api/v1/infostds
         *
         * @apiSuccessExample {json} Success-Response:
         *
         * 	HTTP/1.1  200 OK
         * 	Content-Type: application/json
         *  {"name": "Test-Name", "description": "Test description", "active": 1, "idInfStandardName": 43}
         *
         */
        server.post({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, AddInfoStandardName);

        namespace(server, "/:idInfStandardName", function() {

            /**
             * @api {put} /infostds/:idInfStandardName UpdateInfoStandardName
             * @apiVersion 1.0.0
             * @apiName UpdateInfoStandardName
             * @apiGroup InfoStandard
             * @apiDescription Update InfoStandardName
             *
             * @apiExample {curl} Example usage:
             *    curl -H "Content-Type: application/json" -X PUT -d '{"idInfStandardName": 43, "name": "Test-Name", "description": "New Test description", "active": 1}}' http://localhost:3000/api/v1/infostds/43
             *
             * @apiSuccessExample {json} Success-Response:
             *
             * 	HTTP/1.1  200 OK
             * 	Content-Type: application/json
             *  {"name": "Test-Name", "description": "New Test description", "active": 1, "idInfStandardName": 43}
             *
             */
            server.put({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, UpdateInfoStandardName);

            /**
             * @api {get} /infostds/:idInfStandardName GetInfoStandardName
             * @apiVersion 1.0.0
             * @apiName GetInfoStandardName
             * @apiGroup InfoStandard
             * @apiDescription InfoStandardName detail
             *
             * @apiExample {curl} Example usage:
             * 	curl -X GET http://localhost:8081/api/v1/infostds/1
             *
             */
            server.get({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, GetInfoStandardName);

            namespace(server, "/versions", function() {

                /**
                 * @api {get} /infostds/:idInfStandardName/versions GetInfoStandardVersions
                 * @apiVersion 1.0.0
                 * @apiName GetInfoStandardVersions
                 * @apiGroup InfoStandard
                 * @apiParam {Boolean} [last]  Optional. True for retrieve last only version
                 * @apiDescription Return list of Informative standard
                 *
                 * @apiExample {curl} Example usage:
                 * 	curl -X GET http://localhost:8081/api/v1/infostds/1/versions?last=true
                 *
                 */
                server.get({
                    path: "/",
                    version: confRoutes.VERSION_1_0_0
                }, GetInfoStandardVersions);

                /**
                 * @api {post} /infostds/:idInfStandardName/versions AddInfoStandard
                 * @apiVersion 1.0.0
                 * @apiName AddInfoStandard
                 * @apiGroup InfoStandard
                 * @apiDescription Add Informative standard version for a Informative Standard Name
                 *
                 * @apiExample {curl} Example usage:
                 *    curl -H "Content-Type: application/json" -X POST -d '{"fullpath": "relative/path/to/file", "active": 1}' http://localhost:3000/api/v1/infostds/1/versions
                 *
                 * @apiSuccessExample {json} Success-Response:
                 *
                 * 	HTTP/1.1  200 OK
                 * 	Content-Type: application/json
                 *  {
                 *  "creationDate": "2016-10-22T00:00:00.000Z",
                 *  "version": 5,
                 *  "fullpath": "relative/path/to/file",
                 *  "active": 1,
                 *  "idInformativeStandard": 35
                 *  }
                 */
                server.post({
                    path: "/",
                    version: confRoutes.VERSION_1_0_0
                }, AddInfoStandard);

                namespace(server, "/:idInfStandard", function() {

                    /**
                     * @api {get} /infostds/:idInfStandardName/versions/:idInfStandard GetInfoStandardVersion
                     * @apiVersion 1.0.0
                     * @apiName GetInfoStandardVersion
                     * @apiGroup InfoStandard
                     * @apiDescription Return Informative standard version detail
                     *
                     * @apiExample {curl} Example usage:
                     * 	curl -X GET http://localhost:8081/api/v1/infostds/1/versions/1
                     *
                     */
                    server.get({
                        path: "/",
                        version: confRoutes.VERSION_1_0_0
                    }, GetInfoStandardVersion);


                    /**
                     * @api {put} /infostds/:idInfStandardName/versions/:idInfStandard UpdateInfoStandard
                     * @apiVersion 1.0.0
                     * @apiName UpdateInfoStandard
                     * @apiGroup InfoStandard
                     * @apiDescription Update InfoStandard
                     *
                     * @apiExample {curl} Example usage:
                     *    curl -H "Content-Type: application/json" -X PUT -d '{"fullpath": "relative/path/to/file", "active": 1}' http://localhost:3000/api/v1/infostds/1/versions/35
                     *
                     * @apiSuccessExample {json} Success-Response:
                     *
                     * 	HTTP/1.1  200 OK
                     * 	Content-Type: application/json
                     *  {
                     *  "creationDate": "2016-10-22T00:00:00.000Z",
                     *  "version": 5,
                     *  "fullpath": "relative/path/to/file",
                     *  "active": 1,
                     *  "idInformativeStandard": 35
                     *  }
                     *
                     */
                    server.put({
                        path: "/",
                        version: confRoutes.VERSION_1_0_0
                    }, UpdateInfoStandard);

                    namespace(server, "/attachs", function() {

                        /**
                         * @api {post} /infostds/:idInfStandardName/versions/:idInfStandard/attachs AddInfoStandardAttach
                         * @apiVersion 1.0.0
                         * @apiName AddInfoStandardAttach
                         * @apiGroup InfoStandard
                         * @apiDescription Add attach for a Informative standard version
                         *
                         * @apiExample {curl} Example usage:
                         *    curl -H "Content-Type: application/json" -X POST -d '{"fullpath": "relative/path/to/file", "name": "name"}' http://localhost:3000/api/v1/infostds/1/versions/10/attachs
                         *
                         * @apiSuccessExample {json} Success-Response:
                         *
                         * 	HTTP/1.1  200 OK
                         * 	Content-Type: application/json
                         *  {
                         *  "fullpath": "relative/path/to/file",
                         *  "name": "name",
                         *  "idIsAttachment": 35
                         *  }
                         */
                        server.post({
                            path: "/",
                            version: confRoutes.VERSION_1_0_0
                        }, AddInfoStandardAttach);

                        namespace(server, "/:idIsAttachment", function() {

                            /**
                             * @api {put} /infostds/:idInfStandardName/versions/:idInfStandard/attachs/:idIsAttachment UpdateInfoStandardAttach
                             * @apiVersion 1.0.0
                             * @apiName UpdateInfoStandardAttach
                             * @apiGroup InfoStandard
                             * @apiDescription Update attach for a Informative standard version
                             *
                             * @apiExample {curl} Example usage:
                             *    curl -H "Content-Type: application/json" -X PUT -d '{"name": "new name"}' http://localhost:3000/api/v1/infostds/1/versions/10/attachs/35
                             *
                             * @apiSuccessExample {json} Success-Response:
                             *
                             * 	HTTP/1.1  200 OK
                             * 	Content-Type: application/json
                             *  {
                             *  "fullpath": "relative/path/to/file",
                             *  "name": "new name",
                             *  "idIsAttachment": 35
                             *  }
                             *
                             */
                            server.put({
                                path: "/",
                                version: confRoutes.VERSION_1_0_0
                            }, UpdateInfoStandardAttach);

                            /**
                             * @api {del} /infostds/:idInfStandardName/versions/:idInfStandard/attachs/:idIsAttachment DeleteInfoStandardAttach
                             * @apiVersion 1.0.0
                             * @apiName DeleteInfoStandardAttach
                             * @apiGroup InfoStandard
                             * @apiDescription Delete attach for a Informative standard version
                             *
                             * @apiExample {curl} Example usage:
                             * 	curl -X DEL http://localhost:8081/api/v1/infostds/1/versions/10/attachs/1"
                             *
                             */
                            server.del({
                                path: "/",
                                version: confRoutes.VERSION_1_0_0
                            }, DeleteInfoStandardAttach);
                        })
                    })
                })
            })
        })
    })

    function GetInfoStandardNames(req, res, next) {
        logMetadata.method = "GetInfoStandardNames";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        serviceInformativeStandard.getInfoStandardNames()
            .then(function(collection) {
                logger.log.debug("InfoStandardNames collection: %s", JSON.stringify(collection.toJSON()), logMetadata);
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during Get InfoStandardNames list."));
            });
    };

    function AddInfoStandardName(req, res, next) {
        logMetadata.method = "AddInfoStandardName";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let infoStandardNameParams = {
            "name": inputJson.name,
            "description": inputJson.description,
            "active": inputJson.active
        };

        serviceInformativeStandard.addInfoStandardName(infoStandardNameParams)
            .then(function(infoStandardName) {
                logger.log.debug("infoStandardName created : %s", JSON.stringify(infoStandardName.toJSON()), logMetadata);
                res.send(infoStandardName.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during add infoStandardName."));
            });
    };

    function UpdateInfoStandardName(req, res, next) {
        logMetadata.method = "UpdateInfoStandardName";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let idInfStandardName = inputJson.idInfStandardName || req.params.idInfStandardName;
        if (idInfStandardName == undefined || idInfStandardName == null) {
            return next(new restify.BadRequestError("Invalid idInfStandardName"));
        }

        let infoStandardNameParams = inputJson;
        infoStandardNameParams.idInfStandardName = idInfStandardName;
        /*
                let infoStandardNameParams = {
                    "idInfStandardName": inputJson.idInfStandardName || req.params.idInfStandardName,
                    "name": inputJson.name,
                    "description": inputJson.description,
                    "active": inputJson.active
                };
                */

        serviceInformativeStandard.updateInfoStandardName(infoStandardNameParams)
            .then(function(infoStandardName) {
                logger.log.debug("infoStandardName updated : %s", JSON.stringify(infoStandardName.toJSON()), logMetadata);
                res.send(infoStandardName.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during add infoStandardName."));
            });
    };

    function GetInfoStandardName(req, res, next) {
        logMetadata.method = "GetInfoStandardName";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idInfStandardName = req.params.idInfStandardName;
        if (idInfStandardName == undefined || idInfStandardName == null) {
            idInfStandardName = "";
        }
        logger.log.debug("idInfStandardName: %s", idInfStandardName, logMetadata);

        serviceInformativeStandard.getInfoStandardName(idInfStandardName)
            .then(function(infStandardName) {
                logger.log.debug("InfoStandardName : %s", JSON.stringify(infStandardName), logMetadata);
                if (infStandardName) {
                    res.send(infStandardName.toJSON());
                }
                else {
                    next(new restify.NotFoundError("Unknow InfoStandardName. Sorry !"));
                }
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during Get InfoStandardName details."));
            });
    };

    function GetInfoStandardVersions(req, res, next) {
        logMetadata.method = "GetInfoStandardVersions";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        logger.log.debug("req.query: -%s-", JSON.stringify(req.query), logMetadata);


        let idInfStandardName = req.params.idInfStandardName;
        if (idInfStandardName == undefined || idInfStandardName == null) {
            idInfStandardName = "";
        }
        logger.log.debug("idInfStandardName: -%s-", idInfStandardName, logMetadata);

        let last = req.query.last;
        logger.log.debug("last: -%s-", last, logMetadata);

        serviceInformativeStandard.getInfoStandards(idInfStandardName, last)
            .then(function(infoStandards) {
                logger.log.debug("infoStandards : %s", JSON.stringify(infoStandards), logMetadata);
                if (infoStandards) {
                    res.send(infoStandards.toJSON());
                }
                else {
                    next(new restify.NotFoundError("Unknow InfoStandardName. Sorry !"));
                }
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during Get infoStandards list."));
            });
    };

    function GetInfoStandardVersion(req, res, next) {
        logMetadata.method = "GetInfoStandardVersion";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idInfStandard = req.params.idInfStandard;
        if (idInfStandard == undefined || idInfStandard == null) {
            idInfStandard = "";
        }
        logger.log.debug("idInfStandard: %s", idInfStandard, logMetadata);

        serviceInformativeStandard.getInfoStandard(idInfStandard)
            .then(function(infStandard) {
                logger.log.debug("infStandard : %s", JSON.stringify(infStandard), logMetadata);
                if (infStandard) {
                    res.send(infStandard.toJSON());
                }
                else {
                    next(new restify.NotFoundError("Unknow infStandard. Sorry !"));
                }
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during Get InfoStandard details."));
            });

    };

    function AddInfoStandard(req, res, next) {
        logMetadata.method = "AddInfoStandard";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }
        let idInfStandardName = parseInt(req.params.idInfStandardName, null);
        if (idInfStandardName == undefined || idInfStandardName == null) {
            next(new restify.BadRequestError("Invalid idInfStandardName"));
        }
        logger.log.debug("idInfStandardName: -%d-", idInfStandardName, logMetadata);

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let infoStandardParams = {
            //"creationDate": inputJson.creationDate,
            "version": 0, //inputJson.version,
            "fullpath": inputJson.fullpath,
            "active": inputJson.active,
            "idInfStandardName": idInfStandardName
        };

        serviceInformativeStandard.addInfoStandard(infoStandardParams)
            .then(function(infoStandard) {
                logger.log.debug("infoStandard created : %s", JSON.stringify(infoStandard.toJSON()), logMetadata);
                res.send(infoStandard.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during add infoStandard."));
            });
    };

    function UpdateInfoStandard(req, res, next) {
        logMetadata.method = "UpdateInfoStandard";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let idInfStandard = parseInt(req.params.idInfStandard, null);
        if (idInfStandard == undefined || idInfStandard == null) {
            next(new restify.BadRequestError("Invalid idInfStandard"));
        }
        logger.log.debug("idInfStandard: -%d-", idInfStandard, logMetadata);

        let infoStandardParams = inputJson;
        infoStandardParams.idInformativeStandard = idInfStandard;
        /*
                let infoStandardParams = {
                    "idInformativeStandard": idInfStandard,
                    "fullpath": inputJson.fullpath,
                    "active": inputJson.active
                };
                */

        serviceInformativeStandard.updateInfoStandard(infoStandardParams)
            .then(function(infoStandard) {
                logger.log.debug("infoStandard updated : %s", JSON.stringify(infoStandard.toJSON()), logMetadata);
                res.send(infoStandard.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during update infoStandard."));
            });
    };

    function AddInfoStandardAttach(req, res, next) {
        logMetadata.method = "AddInfoStandardAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }
        let idInfStandard = parseInt(req.params.idInfStandard, null);
        if (idInfStandard == undefined || idInfStandard == null) {
            next(new restify.BadRequestError("Invalid idInfStandard"));
        }
        logger.log.debug("idInfStandard: -%d-", idInfStandard, logMetadata);

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let attachParams = {
            "fullpath": inputJson.fullpath,
            "name": inputJson.name,
            "idInformativeStandard": idInfStandard
        };

        serviceInformativeStandard.addInfoStandardAttach(attachParams)
            .then(function(attach) {
                logger.log.debug("attach created : %s", JSON.stringify(attach.toJSON()), logMetadata);
                res.send(attach.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during add attach."));
            });
    };

    function UpdateInfoStandardAttach(req, res, next) {
        logMetadata.method = "UpdateInfoStandardAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let idIsAttachment = parseInt(req.params.idIsAttachment, null);
        if (idIsAttachment == undefined || idIsAttachment == null) {
            next(new restify.BadRequestError("Invalid idIsAttachment"));
        }
        logger.log.debug("idIsAttachment: -%d-", idIsAttachment, logMetadata);

        inputJson.idIsAttachment = idIsAttachment;
        let params = inputJson;
        /*
        let params = {
            "fullpath": inputJson.fullpath,
            "name": inputJson.name
        };
        */

        serviceInformativeStandard.updateInfoStandardAttach(params)
            .then(function(attach) {
                logger.log.debug("attach updated : %s", JSON.stringify(attach.toJSON()), logMetadata);
                res.send(attach.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during update attach."));
            });
    };

    function DeleteInfoStandardAttach(req, res, next) {
        logMetadata.method = "DeleteInfoStandardAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idIsAttachment = req.params.idIsAttachment;
        if (idIsAttachment == undefined || idIsAttachment == null) {
            next(new restify.BadRequestError("Invalid input (idIsAttachment)"));
        }
        logger.log.debug("idIsAttachment: %s", idIsAttachment, logMetadata);

        serviceInformativeStandard.removeInfoStandardAttach(idIsAttachment)
            .then(function(msg) {
                logger.log.debug("Attach deleted", logMetadata);
                res.send(msg);
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during delete attach from informativeStandard. Error: " + error.detail));
            });
    };


}

module.exports = routes;
