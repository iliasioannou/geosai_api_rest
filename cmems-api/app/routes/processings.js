"use strict";
const routes = function(server) {
    const confRoutes = require("./config");
    const namespace = require("restify-namespace");
    const serviceUsers = require("../services/users");
    const serviceProcessings = require("../services/processings");
    const restify = require("restify");
    const logger = require("../utils/log");
    const chalk = require("chalk");

    const logMetadata = {
        module: "routes.processing",
        method: ""
    };


    const PATH = "/processings";
    namespace(server, PATH, function() {

        /**
         * @api {post} /processings Add Processing
         * @apiVersion 1.0.0
         * @apiName AddProcessing
         * @apiGroup Processing
         * @apiDescription Add processing
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
        }, addProcessing);

    });

    function addProcessing(req, res, next) {
        logMetadata.method = "AddProcessing";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        logger.log.debug("Richiesta: " + req);
        logger.log.debug("username in Richiesta: <" + req.username + ">");

        if (!req.body || req.body === "") {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let username = req.username;

        serviceUsers.existUser(username)
            .then(function(exist) {
                logger.log.debug("Username -%s- exist ? %s", username, (exist ? "Y" : "N"), logMetadata);
                if (!exist) {
                    next(new restify.InternalServerError("User does not exist"));
                }
                else {
                    serviceUsers.getUserByUsername(username)
                      .then(function(user){
                          let userObject = user.toJSON();
                          let email = userObject.email;
                          logger.log.debug("User data: " + JSON.stringify(user) );

                          if(userObject.username === 'anonymous'){
                              next(new restify.InvalidCredentialsError("Unauthorized user."));
                          }

                          let processingParams = {
                            userEmail: email,
                            processingInputData: inputJson
                          };

                          serviceProcessings.addProcessing(processingParams)
                              .then(function(response){
                                if(done){
                                  var message = '';
                                  switch(response.statusCode){
                                      case 201:
                                        message = 'Processing taken in charge.';
                                        break;
                                      case 400:
                                        message = 'Please check your request parameters.'
                                        break;
                                      case 409:
                                        message = response.message.join('\n');
                                        break;
                                      default:
                                        message = 'Unexpected error.';
                                        break;
                                  }
                                  res.send(response.statusCode, message);
                                }
                              })
                              .catch(function(error){
                                  next(new restify.InternalServerError(error));
                              })

                      })
                      .catch(function(error){
                          logger.log.error(error, logMetadata);
                          next(new restify.InternalServerError("Problem with retrieving the user."));
                      })

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

}



module.exports = routes;
