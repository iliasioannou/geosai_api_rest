/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";

var routes = function (server) {
    var restify = require("restify");
    var versioning = require("restify-url-semver");
    const path = require("path");
    const chalk = require("chalk");
    var configuration = require("../config/serverConfig.js");
    var confRoutes = require("./config.js");


    const logger = require("../utils/log.js");

    let logMetadata = {
        module: "routes.base",
        method: ""
    };

    logger.log.debug("Route version: -%s-", confRoutes.VERSION_1_0_0);

    server.pre(versioning({
        prefix: configuration.api.prefix
    }));

    //server.use(auth_middleware.checkForUnsecuredPath);

    server.use(function (req, res, next) {
        logger.log.debug(logger.utils.dividerEquals);
        logger.log.debug("Server ver            : %s", configuration.server.version);
        logger.log.debug("Api ver               : %s", configuration.api.version);
        logger.log.debug("Time request          : %s", (new Date()).toISOString());
        logger.log.debug("Requesting host       : %s", req.header("Host"));
        logger.log.debug("Http method           : %s", req.method);
        logger.log.debug("Http origin           : %s", req.header("Origin"));
        logger.log.debug("Http accept           : %s", req.header("Accept"));
        logger.log.debug("Http accept-ver       : %s", req.header("Accept-Version"));
        logger.log.debug("Http Accept-Charset   : %s", req.header("Accept-Charset"));
        logger.log.debug("Http Accept-Encoding  : %s", req.header("Accept-Encoding"));
        logger.log.debug("Http Accept-Language  : %s", req.header("Accept-Language"));
        logger.log.debug("Http Cache-Control    : %s", req.header("Cache-Control"));
        logger.log.debug("Http auth.            : %s", JSON.stringify(req.authorization));
        logger.log.debug("Http url              : %s", req.url);
        logger.log.debug("Http User-Agent       : %s", req.header("User-Agent"));
        logger.log.debug("Content length        : %s", req.contentLength());
        logger.log.debug("Content type          : %s", req.contentType());
        logger.log.debug("IsChunked             : %s", req.isChunked());
        logger.log.debug("Files                 : %s", JSON.stringify(req.files));
        logger.log.debug("Auth. username        : %s", req.username);
        logger.log.debug("Request params        : %s", JSON.stringify(req.params));
        logger.log.debug("Request query         : %s", JSON.stringify(req.query));
        logger.log.debug("Paginate page (num)   : %s", req.paginate.page);
        logger.log.debug("Paginate per_page     : %s", req.paginate.per_page);
        logger.log.debug("Paginate              : %s", JSON.stringify(req.paginate));
        logger.log.debug("");
        next();
    });

    /**
     * @api {get} /info  Api info
     * @apiVersion 1.0.0
     * @apiName Info
     * @apiGroup Help
     * @apiDescription Info on api rest
     *
     * @apiExample {curl} Example usage:
     * 	curl -i http://localhost:8081/api/vX/info
     *
     * @apiSuccess {Json} object Json object containing information on api rest
     * @apiSuccess {Json} object.server Json object with server information
     * @apiSuccess {String} object.server.name Server name
     * @apiSuccess {String} object.server.version Server version
     * @apiSuccess {Json} object.api Json object with API REST information
     * @apiSuccess {String} object.api.version Version of the API REST
     * @apiSuccess {String} object.api.apidoc Api help online url
     *
     * @apiSuccessExample  Success-response:
     * HTTP/1.1 200 OK
     * Content-Type: application/json
     * Content-Length: 149
     * Date: Fri, 12 Feb 2016 02:03:38 GMT
     * Connection: keep-alive
     *
     * {"server":{"name":"pke114 ICWM For Med - Api Rest","version":"1.0.0"},"api":{"version":"1.0.0","apidoc":"/apidoc"}}
     *
     */
    server.get({
        path: "/info",
        version: confRoutes.VERSION_1_0_0
    }, sendInfo);

    function getInfo() {
        return {
            "server": {
                "name": configuration.server.name,
                "version": configuration.server.version,
                "buildDate": configuration.server.buildDate
            },
            "api": {
                "version": confRoutes.VERSION,
                "apidoc": configuration.api.apidoc
            }
        };
    }

    function sendInfo(req, res, next) {
        logMetadata.method = "info";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        res.send(getInfo());
        return next();
    }



    /**
     * @api {get} /apidoc Api doc
     * @apiVersion 1.0.0
     * @apiName Apidoc
     * @apiGroup Help
     * @apiDescription Api rest help on line
     *
     * @apiExample {curl} Example usage:
     * 	curl -i http://localhost:8081/api/vX/apidoc
     *
     */
    server.get({
        path: /apidoc/,
        version: confRoutes.VERSION_1_0_0
    }, function (req, res, next) {
        let redirectToApidoc = "apidoc/index.html";
        let apidocRootPath = configuration.api.apidoc;
        if (apidocRootPath) {
            logger.log.debug("apidocRootPath: %s", apidocRootPath);
        } else {
            logger.log.debug("apidocRootPath: is empty");
        }


        logger.log.debug("configuration.api.apidoc: %s", configuration.api.apidoc);
        logger.log.debug("configuration.api.apidoc.length: %d", configuration.api.apidoc.length);
        logger.log.debug("req.url: %s", req.url);
        req.url = req.url.substr(configuration.api.apidoc.length + 3); //TODO: eliminare la costante 3 che serve a gestore  ///
        logger.log.debug("req.url: %s", req.url);

        if (req.url.length > 0) {
            logger.log.debug("req.url.length > 0");
            var regexpExcludeQueryString = /[^?]+/g;
            var match = regexpExcludeQueryString.exec(req.url);
            req.url = match[0];
            logger.log.debug("req.url: %s", req.url);
            req.path = function () {
                return req.url;
            };
            logger.log.debug("req.path: %s", req.path());
            var serve = restify.serveStatic({
                directory: apidocRootPath
            });

            serve(req, res, next);
        } else {
            logger.log.debug("redirect to: %s", redirectToApidoc);
            res.redirect(redirectToApidoc, next);
        }

    });


    /**
     * @api {get} /download Download
     * @apiVersion 1.0.0
     * @apiName Apidoc
     * @apiGroup Help
     * @apiDescription Download file (monitoring or infor standard files)
     *
     * @apiExample {curl} Example usage for download monitoring file:
     *  curl -i http://<server>:<port>/monitoringfiles/<idMonitoringFiles>
     *  
     * @apiExample {curl} Example usage for download attach of monitoring file:
     *  curl -i http://<server>:<port>/monitoringfiles/<idMonitoringFiles>.xls/<idMonitoringFiles>/<idMonitoringFileAttach>.<ext>
     *
     * @apiExample {curl} Example usage for download info standard file:
     *  curl -i http://<server>:<port>/informativestandard/<idInformativeStandard>.<ext>
     *  
     */
    server.get({
        path: /\/download\/.*/,
        version: confRoutes.VERSION_1_0_0
    }, function (req, res, next) {

        logger.log.debug("req.path: %s", req.path());
        let docRepository = configuration.docRepo.rootPath;

        let relativeUrl = req.path().replace("download", "");
        if (req.path().search(configuration.docRepo.monitoringFilesPath) > -1) {
            relativeUrl = relativeUrl.replace(configuration.docRepo.monitoringFilesPath, "");
            docRepository = docRepository + path.sep + configuration.docRepo.monitoringFilesPath;
        } else if (req.path().search(configuration.docRepo.infoStandardFilesPath) > -1) {
            relativeUrl = relativeUrl.replace(configuration.docRepo.infoStandardFilesPath, "");
            docRepository = docRepository + path.sep + configuration.docRepo.infoStandardFilesPath;
        }
        logger.log.debug("docRepository (monfiles): %s", docRepository);

        req.url = relativeUrl;
        logger.log.debug("req.url: %s", req.url);

        req.path = function () {
            return req.url;
        };
        logger.log.debug("req.path: %s", req.path());

        var serve = restify.serveStatic({
            directory: docRepository
        });

        serve(req, res, next);
    });
};

module.exports = routes;
