"use strict";
const routes = function(server) {
    const confRoutes = require("./config");
    const namespace = require("restify-namespace");
    const serviceUsers = require("../services/users");
    const serviceUserRegions = require("../services/userRegions");
    const restify = require("restify");
    const logger = require("../utils/log");
    const chalk = require("chalk");

    const logMetadata = {
        module: "routes.user",
        method: ""
    };


    /**
     * @api {get} /login Login
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup User
     * @apiDescription Check user identity
     * @apiHeader {string} Authorization Basic authorization token
     * @apiHeaderExample Basic authorization example:
     * 					Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
     *
     * @apiExample {curl} Example usage:
     * 	curl -X GET -i --user username:password  "http://localhost:8081/api/v1/login"
     *
     * @apiError NotAuthorizedError user is not present into system or password is wrong
     * @apiErrorExample {json} Error-response:
     *
     * 	HTTP/1.1 403 Forbidden
     * 	Content-Type: application/json
     * 	Content-Length: 37
     * 	Date: Thu, 11 Feb 2016 14:42:02 GMT
     * 	Connection: keep-alive
     *
     * 	{"code":"NotAuthorized","message":""}
     *
     */
    server.get({
        path: "/login",
        version: confRoutes.VERSION_1_0_0
    }, login);


    const PATH = "/users";
    namespace(server, PATH, function() {

        /**
         * @api {get} /users GetUsers
         * @apiVersion 1.0.0
         * @apiName GetUsers
         * @apiGroup User
         * @apiDescription User's list
         *
         * @apiExample {curl} Example usage:
         * 	curl -X GET http://localhost:8081/api/v1/users"
         *
         */
        server.get({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, getUsers);


        /**
         * @api {post} /users AddUser
         * @apiVersion 1.0.0
         * @apiName AddUser
         * @apiGroup User
         * @apiDescription Add user
         *
         * @apiExample {curl} Example usage:
         *    curl -H "Content-Type: application/json" -X POST -d '{"email": "nome.cognome@ispra.it","name": "nome","surname": "cognome","username": "username","password": "pass","idRole": 3,"idAmp": null,"idCnr": null,"idArpa": 1,"idOrganizationType": 4,"active": "1"}' http://localhost:3000/api/v1/users
         *
         * @apiSuccessExample {json} Success-Response:
         * 	HTTP/1.1  200 OK
         * 	Content-Type: application/json
         *  {"email": "nome.cognome@ispra.it","name": "nome","surname": "cognome","username": "username","password": "pass","idRole": 3,"idArpa": 1,"idOrganizationType": 4,"active": 1,"idUser": 6}
         *
         * @apiErrorExample  {json} Error-Response:
         * 	HTTP/1.1  409 Conflict
         * 	Content-Type: application/json
         *  {"code":"ConflictError","message":"Already exist user with same username"}
         *
         * @apiErrorExample  {json} Error-Response:
         * 	HTTP/1.1  501 InternalServerError
         * 	Content-Type: application/json
         *
         */
        server.post({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, addUsers);

        /**
         * @api {put} /users/:iduser UpdateUser
         * @apiVersion 1.0.0
         * @apiName UpdateUser
         * @apiGroup User
         * @apiDescription Update user
         *
         * @apiExample {curl} Example usage:
         *    curl -H "Content-Type: application/json" -X PUT -d '{"email": "nome.cognome@ispra.it","name": "nome","surname": "cognome","username": "username","password": "pass","idRole": 3,"idAmp": null,"idCnr": null,"idArpa": 1,"idOrganizationType": 4,"active": "1"}' http://localhost:3000/api/v1/users
         *
         * @apiSuccessExample {json} Success-Response:
         *
         * 	HTTP/1.1  200 OK
         * 	Content-Type: application/json
         *  {"email": "nome.cognome@ispra.it","name": "nome","surname": "cognome","username": "username","password": "pass","idRole": 3,"idArpa": 1,"idOrganizationType": 4,"active": 1,"idUser": 6}
         *
         */
        server.put({
            path: "/:idUser",
            version: confRoutes.VERSION_1_0_0
        }, updateUser);

        /**
         * @api {get} /users/:iduser GetUser
         * @apiVersion 1.0.0
         * @apiName GetUser
         * @apiGroup User
         * @apiDescription User details
         *
         * @apiExample {curl} Example usage:
         * 	curl -X GET http://localhost:8081/api/v1/users/1"
         *
         */
        server.get({
            path: "/:idUser",
            version: confRoutes.VERSION_1_0_0
        }, getUser);

        namespace(server, "/:idUser/regions", function() {

            /**
             * @api {get} /users/:iduser/regions GetUserRegions
             * @apiVersion 1.0.0
             * @apiName GetUserRegions
             * @apiGroup User
             * @apiDescription Get enabled regions for the user
             *
             * @apiExample {curl} Example usage:
             * 	curl -X GET http://localhost:8081/api/v1/users/1/regions"
             *
             */
            server.get({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, getUserRegions);

            /**
             * @api {post} /users/:iduser/regions AddRegionToUser
             * @apiHeader {String} Content-Type set to application/json
             * @apiHeaderExample Example:
                Content-Type=application/json
             * @apiVersion 1.0.0
             * @apiName AddRegionToUser
             * @apiGroup User
             * @apiDescription Add region to user. IMP: for isDefault set "0" or "1"
             *
             * @apiExample {curl} Example usage:
             *    curl -H "Content-Type: application/json" -X POST -d '{"idUser": 1, "idRegion": 6, "isDefault": "0"}' http://localhost:8081/api/v1/users/1/regions
             *    curl -H "Content-Type: application/json" -X POST -d '{"idRegion": 6, "isDefault": "0"}"' http://localhost:8081/api/v1/users/1/regions
             *
             * @apiSuccessExample {json} Success-Response:
             *
             * 	HTTP/1.1  200 OK
             * 	Content-Type: application/json
             *  {"idUser": 1,"idRegion": 6,"isDefault": 0,"idUserRegion": 18}
             *
             */
            server.post({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, addRegionToUser);

            /**
             * @api {del} /users/:idUser/regions/:idUserRegion DelUserRegion
             * @apiVersion 1.0.0
             * @apiName DelUserRegion
             * @apiGroup User
             * @apiDescription Delete relation between region and user.
             *
             * @apiExample {curl} Example usage:
             * 	curl -X DEL http://localhost:8081/api/v1/users/1/regions/1"
             *
             */
            server.del({
                path: "/:idUserRegion",
                version: confRoutes.VERSION_1_0_0
            }, delUserRegion);

            /**
             * @api {del} /users/:idUser/regions DelAllUserRegion
             * @apiVersion 1.0.0
             * @apiName DelAllUserRegion
             * @apiGroup User
             * @apiDescription Delete all relation between region and user.
             *
             * @apiExample {curl} Example usage:
             * 	curl -X DEL http://localhost:8081/api/v1/users/1/regions"
             *
             */
            server.del({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, delAllUserRegion);
        })
    })


    function login(req, res, next) {
        logMetadata.method = "Login";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        logger.log.debug("Http header authorization: %s ", JSON.stringify(req.authorization), logMetadata);

        // var authSchema = req.authorization.scheme;
        // if (authSchema !== "Basic") {
        //     logger.log.debug("Authorization schema must be Basic");
        //     next(new restify.NotAuthorizedError());
        // }

        // const user = req.authorization.basic;
        // logger.log.debug("User: %s", JSON.stringify(user));

        // if (!user || !user.username || !user.password) {
        //     logger.log.debug("User Credential empty", logMetadata);
        //     next(new restify.NotAuthorizedError());
        // }

        logger.log.debug("User: ", req.username);
        // serviceUsers.login(user)
        //     .then(function(userDb) {
        //         if (userDb) {
        //             logger.log.debug("User from db: <%s>", JSON.stringify(userDb), logMetadata);
        //             res.send(userDb.toJSON());
        //         }
        //         else {
        //             logger.log.debug("User <%s> not exits", user.username, logMetadata);
        //             next(new restify.NotAuthorizedError());
        //         }
        //     })
        //     .catch(function(err) {
        //         logger.log.debug(err);
        //         next(new restify.NotAuthorizedError(err));
        //     });

        serviceUsers.getUserByUsername(req.username).then(function(result){
            res.send(result.toJSON());
        }).catch(function(result){
            logger.log.debug(result);
            next(new restify.NotAuthorizedError(result));
        })
    };

    function getUsers(req, res, next) {
        logMetadata.method = "GetUsers";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        serviceUsers.getUsers()
            .then(function(collection) {
                logger.log.debug("User collection: %s", JSON.stringify(collection.toJSON()));
                res.send(collection.toJSON());
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
    }

    function addUsers(req, res, next) {
        logMetadata.method = "AddUsers";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === "") {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let username = inputJson.username;
        logger.log.debug("username = -%s-", username, logMetadata);
        if (!username) {
            next(new restify.BadRequestError("Invalid username"));
        }

        let userParams = {
            "email": inputJson.email,
            "name": inputJson.name,
            "surname": inputJson.surname,
            "username": username,
            "password": inputJson.password,
            "idRole": inputJson.idRole || null,
            "active": inputJson.active || "1",
            "note": inputJson.note || null,
        };

        serviceUsers.existUser(username)
            .then(function(exist) {
                logger.log.debug("Username -%s- exist ? %s", username, (exist ? "Y" : "N"), logMetadata);
                if (exist) {
                    logger.log.warn("Already exist user with same username", logMetadata);
                    next(new restify.ConflictError("Already exist user with same username"));
                }
                else {
                    serviceUsers.addUser(userParams)
                        .then(function(user) {
                            logger.log.debug("user created : %s", JSON.stringify(user.toJSON()), logMetadata);
                            res.send(user.toJSON());
                        })
                        .catch(function(error) {
                            logger.log.error(error, logMetadata);
                            next(new restify.InternalServerError("Problem during add user."));
                        });
                }
            });
    }

    function updateUser(req, res, next) {
        logMetadata.method = "UpdateUser";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === "") {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let idUser = inputJson.idUser || inputJson.iduser || req.params.idUser;
        if (idUser == undefined || idUser == null) {
            return next(new restify.BadRequestError("Invalid idUser"));
        }

        let userParams = inputJson;
        userParams.idUser = idUser;
        /*
                let userParams = {
                    "idUser": inputJson.idUser || inputJson.iduser || req.params.idUser,
                    "email": inputJson.email,
                    "name": inputJson.name,
                    "surname": inputJson.surname,
                    "username": inputJson.username,
                    "password": inputJson.password,
                    "idRole": inputJson.idRole || inputJson.idrole,
                    "idAmp": inputJson.idAmp || inputJson.idamp,
                    "idCnr": inputJson.idCnr || inputJson.idcnr,
                    "idArpa": inputJson.idArpa || inputJson.idarpa,
                    "idOrganizationType": inputJson.idOrganizationType || inputJson.idorganizationType || inputJson.idorganizationtype || inputJson.idOrganizationtype,
                    "active": inputJson.active
                };
        */
        serviceUsers.updateUser(userParams)
            .then(function(user) {
                logger.log.debug("user created : %s", JSON.stringify(user.toJSON()), logMetadata);
                res.send(user.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during update user."));
            });
        //next();
    }

    function getUser(req, res, next) {
        logMetadata.method = "GetUser";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idUser = req.params.idUser;
        if (idUser == undefined || idUser == null) {
            idUser = "";
        }
        logger.log.debug("idUser: %s", idUser, logMetadata);

        serviceUsers.getUserById(idUser)
            .then(function(user) {
                if (user) {
                    logger.log.debug("user : %s", JSON.stringify(user.toJSON()), logMetadata);
                    res.send(user.toJSON());
                }
                else {
                    next(new restify.NotFoundError("Unknow user. Sorry !"));
                }
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
    }

    function getUserRegions(req, res, next) {
        logMetadata.method = "GetUserRegions";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idUser = req.params.idUser;
        if (idUser == undefined || idUser == null) {
            idUser = "";
        }
        logger.log.debug("idUser: %s", idUser, logMetadata);

        serviceUserRegions.getUserRegions(idUser)
            .then(function(userRegions) {
                if (userRegions) {
                    logger.log.debug("regions : %s", JSON.stringify(userRegions.toJSON()), logMetadata);
                    res.send(userRegions.toJSON());
                }
                else {
                    next(new restify.NotFoundError("User without regions. Sorry !"));
                }
            })
            .catch(function(error) {
                logger.log.debug(error);
            });
    }

    function addRegionToUser(req, res, next) {
        logMetadata.method = "AddRegionToUser";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let userRegionParams = {
            "idUser": inputJson.idUser || inputJson.iduser || req.params.idUser,
            "idRegion": inputJson.idRegion || inputJson.idregion,
            "isDefault": inputJson.isDefault || inputJson.isdefault
        };

        //let userRegionParams = inputJson;
        serviceUserRegions.addRegionToUser(userRegionParams)
            .then(function(userRegion) {
                logger.log.debug("userRegion created : %s", JSON.stringify(userRegion.toJSON()), logMetadata);
                res.send(userRegion.toJSON());
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during add region to user."));
            });
    }

    function delUserRegion(req, res, next) {
        logMetadata.method = "DelUserRegion";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idUserRegion = req.params.idUserRegion;
        if (idUserRegion == undefined || idUserRegion == null) {
            next(new restify.BadRequestError("Invalid input (idUserRegion)"));
        }
        logger.log.debug("idUserRegion: %s", idUserRegion, logMetadata);

        serviceUserRegions.removeRegionFromUser(idUserRegion)
            .then(function(msg) {
                logger.log.debug("userRegion deleted", logMetadata);
                res.send(msg);
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during delete region to user. Error: " + error.detail));
            });
    }

    function delAllUserRegion(req, res, next) {
        logMetadata.method = "delAllUserRegion";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idUser = req.params.idUser;
        if (idUser == undefined || idUser == null) {
            next(new restify.BadRequestError("Invalid input (idUser)"));
        }
        logger.log.debug("idUser: %d", idUser, logMetadata);

        serviceUserRegions.removeAllRegionFromUser(idUser)
            .then(function(msg) {
                logger.log.debug("all userRegion deleted", logMetadata);
                res.send(msg);
            })
            .catch(function(error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during delete all region from user. Error: " + error.detail));
            });
    }
}



module.exports = routes;
