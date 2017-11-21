/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";


const restify = require("restify");
const fs = require("fs");
const os = require("os");
const restifyValidation = require("node-restify-validation");
const restifyPaginate = require("restify-paginate");
const configuration = require("./app/config/serverConfig");
const logger = require("./app/utils/log");
const chalk = require('chalk');
const restifyOAuth2 = require("restify-oauth2");
const hooks = require("./app/utils/authHooks");
const util = require("./app/utils/util");


//Create server for HTTP protocol
var http_options = {
    name: configuration.server.name,
    version: configuration.api.version
};
var server_http = restify.createServer(http_options);
logger.log.info(logger.utils.dividerStars);
//logger.log.info(chalk.red("Server created"));
logger.log.info("Server created");
logger.log.info("Working folder: %s", __dirname);

logger.log.info("Doc Repository, root     : %s", configuration.docRepo.rootPath);
logger.log.info("Doc Repository, info stad: %s", configuration.docRepo.infoStandardFilesPath);
logger.log.info("Doc Repository, mon. file: %s", configuration.docRepo.monitoringFilesPath);


//Create server for HTTPS protocol
var https_options = http_options;
https_options.key = fs.readFileSync("./app/ssl/server/privateKey-Server.key");
https_options.certificate = fs.readFileSync("./app/ssl/server/certificate-localhost.crt");
var server_https = restify.createServer(https_options);

var RESOURCES = Object.freeze({
    TOKEN: "/oauth/token",
});

var setup_server = function(server) {
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser({
        mapParams: true,
        maxBodySize: configuration.server.maxBodySize,
        keepExtensions: true,
        uploadDir: os.tmpdir(),
        multiples: false
    }));

    /*
    server.use(restify.bodyParser());
    server.use(restify.bodyParser({
        mapParams: false
    }));
    server.use(restify.jsonp());
    */

    /*
        server.use(restify.queryParser({
            mapParams: false
        }));
      */
    //server.use(restify.queryParser());

    server.use(restify.queryParser({
        mapParams: "true",
        overrideParams: "false"
    }));

    server.use(restify.authorizationParser());

    server.use(restifyValidation.validationPlugin({
        // Show errors as an array
        errorsAsArray: false,
        // Not exclude incoming variables not specified in validator rules
        forbidUndefinedVariables: false,
        //errorHandler: restify.errors.InvalidArgumentError
    }));

    let paginateConf = configuration.api.paginate;
    logger.log.info("paginateConf: %s", JSON.stringify(paginateConf));
    server.use(restifyPaginate(server, paginateConf));

    server.pre(restify.pre.sanitizePath());
    //server.pre(restify.CORS());

    logger.log.info("Configure API routes");

    // inject oauth2 endpoints
    restifyOAuth2.ropc(server, {
        tokenEndpoint: '/oauth/token',
        tokenExpirationTime: 60*60*8,
        hooks: hooks});

    require("./app/routes/routes.js")(server);
};

setup_server(server_http);
setup_server(server_https);


server_http.listen(configuration.server.portHttp, function() {
    logger.log.info("<%s> HTTP server (version %s) listening at <%s>", server_http.name, server_http.versions, server_http.url);
    logger.log.debug(server_http.toString());
});

server_https.listen(configuration.server.portHttps, function() {
    logger.log.info("<%s> HTTPS server (version %s) listening at <%s>", server_https.name, server_https.versions, server_https.url);
    logger.log.debug(server_https.toString());
});
