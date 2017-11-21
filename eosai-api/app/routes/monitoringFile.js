/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";
const routes = function (server) {
    const namespace = require("restify-namespace");
    const restify = require("restify");
    const chalk = require("chalk");
    const moment = require("moment");
    const fs = require("fs");
    const path = require("path");
    const serviceMonitoringFile = require("../services/monitoringFile");
    const confRoutes = require("./config");
    const logger = require("../utils/log");
    const fsUtil = require("../utils/fileSystem");
    const configuration = require("../config/serverConfig");

    const MODULE_NAME = "       [routes.monitoringFile].";

    const PATH = "/monfiles";
    namespace(server, PATH, function () {
        /**
         * @api {get} /monfiles GetMonitoringFiles
         * @apiVersion 1.0.0
         * @apiName GetMonitoringFiles
         * @apiGroup MonitoringFile
         * @apiDescription MonitoringFile's list (the MonitoringFile is a published module)<br>
         * <br>
         * Its possible to filter by means the <b>filter</b> parameter, that must be compliance the following rules:<br>
         * <i>filter=&lt;name column&gt;::&lt;value&gt;;&lt;date name column&gt;::&lt;from,to&gt;</i> <br>
         * <br>
         * allowed format for <b>from</b>/<b>to</b> date is YYYY-MM-DD with <b>from</b> < <b>to</b><br>
         * All the clauses will be concatenate with AND operator<br>
         * <br><br>
         * Its possible to sort the result by means the <b>sort</b> parameter, that must be compliance the following rules:<br>
         * <i>sort=&lt;name column&gt;::&lt;order&gt;;&lt;name column&gt;::&lt;order&gt;</i> <br>
         * It's important the order of single sorting clausole. The items will be sorted considering fisrt the left-most sorting clausole and then the last right condition
         * <br>
         * To control the order type use <b>order</b> with this values:
         * <ul>
         * <li><b>ASC</b>: for ascending order</li>
         * <li><b>DESC</b>: for descending order</li>
         * </ul> <br>
         * <br>
         * Another allowed parameters are relative to pagination:<br>
         * <ul>
         * <li><b>page</b>: to control the page number to request (default = 1)</li>
         * <li><b>per_page</b>: to control the number of items for page (default = 500)</li>
         * </ul>
         * <br>
         * The response will be:<br>
         <i>
         {
             data: [
                    {},
                    {}.
                    ...
                  ],
             pages: {
                 prev: X,
                 next: X,
                 first: X,
                 last: X
             }
         }
         </i>
         * <br><br>
         * Some <b>pages</b> attributes can be missing depening on the combination of <b>page</b>/<b>per_page</b> and the total number of items
         * <br>
         * <br>
         * @apiExample {curl} Example usage:
         *  curl -X GET http://localhost:3000/api/v1/monfiles?page=1&per_page=2&sort=acquisition::DESC;name::ASC&filter=idInformativeStandard::44;idRegion::4;idUser::1;idFileStatus::1;acquisition::2015-01-01,2015-03-01;load::2015-05-01,2015-06-01
         *
         */
        server.get({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, getMonitoringFiles);

        /**
         * @api {post} /monfiles AddMonitoringFile
         * @apiVersion 1.0.0
         * @apiName AddMonitoringFile
         * @apiGroup MonitoringFile
         * @apiDescription Add Monitoring File
         *
         * @apiExample {curl} Example usage:
         *    curl -H "Content-Type: application/json" -X POST -d '{JSON}' http://localhost:3000/api/v1/monfiles
         *    where {JSON}:
         *         {
         *         "idUser": 2,
         *         "idFileStatus": 1,
         *         "idInformativeStandard": 44,
         *         "name": "Test",
         *         "acquisitionStartDate": "2016-03-01",
         *         "acquisitionEndDate": "2016-04-30",
         *         "fullpath": "path/to/file",
         *         "idRegion": 4,
         *         "idArpa": 2
         *         }
         *
         * @apiSuccessExample {json} Success-Response:
         *  HTTP/1.1  200 OK
         *  Content-Type: application/json
         *  {
         *    "idUser": 2,
         *    "idFileStatus": 1,
         *    "idInformativeStandard": 44,
         *    "name": "Test",
         *    "loadDate": "2016-10-25 12:38:26",
         *    "acquisitionStartDate": "2016-03-01",
         *    "acquisitionEndDate": "2016-04-30",
         *    "fullpath": "path/to/file",
         *    "idRegion": 4,
         *    "idCnr": null,
         *    "idArpa": 2,
         *    "idAmp": null,
         *    "idMonitoringFile": 34
         *  }
         */
        server.post({
            path: "/",
            version: confRoutes.VERSION_1_0_0
        }, addMonitoringFile);

        namespace(server, "/:idMonitoringFile", function () {

            /**
             * @api {get} /monfiles/:idMonitoringFile GetMonitoringFile
             * @apiVersion 1.0.0
             * @apiName GetMonitoringFile
             * @apiGroup MonitoringFile
             * @apiDescription MonitoringFile detail
             *
             * @apiExample {curl} Example usage:
             *  curl -X GET http://server:port/api/v1/monfiles/1
             *
             */
            server.get({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, getMonitoringFile);

            /**
             * @api {put} /monfiles/:idMonitoringFile UpdateMonitoringFiles
             * @apiVersion 1.0.0
             * @apiName UpdateMonitoringFile
             * @apiGroup MonitoringFile
             * @apiDescription Update Monitoring File
             *
             * @apiExample {curl} Example usage:
             *    curl -H "Content-Type: application/json" -X PUT -d '{JSON}' http://localhost:3000/api/v1/monfiles/1
             *    where {JSON}:
             *         {
             *         "idFileStatus": 2,
             *         }
             *
             * @apiSuccessExample {json} Success-Response:
             *  HTTP/1.1  200 OK
             *  Content-Type: application/json
             *  {
             *    "idUser": 2,
             *    "idFileStatus": 2,
             *    "idInformativeStandard": 44,
             *    "name": "Test",
             *    "loadDate": "2016-10-25 12:38:26",
             *    "acquisitionStartDate": "2016-03-01",
             *    "acquisitionEndDate": "2016-04-30",
             *    "fullpath": "path/to/file",
             *    "idRegion": 4,
             *    "idCnr": null,
             *    "idArpa": 2,
             *    "idAmp": null,
             *    "idMonitoringFile": 34
             *  }
             */
            server.put({
                path: "/",
                version: confRoutes.VERSION_1_0_0
            }, updateMonitoringFile);

            namespace(server, "/upload", function () {
                /**
                 * @api {post} /monfiles/:idMonitoringFile/upload UploadsMonitoringFile
                 * @apiVersion 1.0.0
                 * @apiName UploadsMonitoringFile
                 * @apiGroup MonitoringFile
                 * @apiDescription Uploads Monitoring File
                 *
                 * @apiExample {curl} Example usage:
                 *    curl -F "file=@/path/to/file/filename.ext" http://<server>:<port>/api/v1/monfiles/1/upload
                 *
                 * @apiSuccessExample {json} Success-Response:
                 *  HTTP/1.1  200 OK
                 *  "Upload completed"
                 */
                server.post({
                    path: "/",
                    version: confRoutes.VERSION_1_0_0
                }, uploadMonitoringFile);
            });

            namespace(server, "/attachs", function () {

                /**
                 * @api {get} /monfiles/:idMonitoringFile/attachs GetMonitoringFileAttachs
                 * @apiVersion 1.0.0
                 * @apiName GetMonitoringFileAttachs
                 * @apiGroup MonitoringFile
                 * @apiDescription retrieve the list of attach files of specific MonitoringFile
                 *
                 * @apiExample {curl} Example usage:
                 *  curl -X GET http://<server>:<port>/api/v1/monfiles/1/attachs
                 *
                 */
                server.get({
                    path: "/",
                    version: confRoutes.VERSION_1_0_0
                }, getMonitoringFileAttachs);

                /**
                 * @api {post} /monfiles/:idMonitoringFile/attachs AddMonitoringFileAttach
                 * @apiVersion 1.0.0
                 * @apiName AddMonitoringFileAttach
                 * @apiGroup MonitoringFile
                 * @apiDescription Add attach to specific MonitoringFile
                 *
                 * @apiExample {curl} Example usage:
                 *    curl -H "Content-Type: application/json" -X POST -d '{"fullpath": "relative/path/to/file", "name": "name"}' http://localhost:3000/api/v1/infostds/1/versions/10/attachs
                 *
                 * @apiSuccessExample {json} Success-Response:
                 *
                 *  HTTP/1.1  200 OK
                 *  Content-Type: application/json
                 *  {
                 *  "fullpath": "relative/path/to/file",
                 *  "name": "name"
                 *  }
                 */
                server.post({
                    path: "/",
                    version: confRoutes.VERSION_1_0_0
                }, addMonitoringFileAttach);

                namespace(server, "/:idMfAttachment", function () {
                    /**
                     * @api {put} /monfiles/:idMonitoringFile/attachs/:idMfAttachment UpdateMonitoringFileAttach
                     * @apiVersion 1.0.0
                     * @apiName UpdateMonitoringFileAttach
                     * @apiGroup MonitoringFile
                     * @apiDescription Update attach of specific MonitoringFile
                     *
                     * @apiExample {curl} Example usage:
                     *    curl -H "Content-Type: application/json" -X PUT -d '{"name": "new name"}' http://<server>:<port>/api/v1/monfiles/1/attachs/1
                     *
                     * @apiSuccessExample {json} Success-Response:
                     *
                     *  HTTP/1.1  200 OK
                     *  Content-Type: application/json
                     *  {
                     *  "fullpath": "relative/path/to/file",
                     *  "name": "new name"
                     *  }
                     *
                     */
                    server.put({
                        path: "/",
                        version: confRoutes.VERSION_1_0_0
                    }, updateMonitoringFileAttach);

                    /**
                     * @api {del} /monfiles/:idMonitoringFile/attachs/:idMfAttachment DeleteMonitoringFileAttach
                     * @apiVersion 1.0.0
                     * @apiName DeleteMonitoringFileAttach
                     * @apiGroup MonitoringFile
                     * @apiDescription Delete attach for a specific MonitoringFile
                     *
                     * @apiExample {curl} Example usage:
                     *  curl -X DEL http://<server>:<port>/api/v1/monfiles/1/attachs/1"
                     */
                    server.del({
                        path: "/",
                        version: confRoutes.VERSION_1_0_0
                    }, deleteMonitoringFileAttach);


                    namespace(server, "/upload", function () {
                        /**
                         * @api {post} /monfiles/:idMonitoringFile/attachs/:idMfAttachment/upload UploadsMonitoringFileAttach
                         * @apiVersion 1.0.0
                         * @apiName UploadsMonitoringFileAttach
                         * @apiGroup MonitoringFile
                         * @apiDescription Uploads Monitoring File Attach
                         *
                         * @apiExample {curl} Example usage:
                         *    curl -F "file=@/path/to/file/filename.ext" http://<server>:<port>/api/v1/monfiles/1/attachs/1/upload
                         *
                         * @apiSuccessExample {json} Success-Response:
                         *  HTTP/1.1  200 OK
                         *  "Upload completed"
                         */
                        server.post({
                            path: "/",
                            version: confRoutes.VERSION_1_0_0
                        }, uploadMonitoringFileAttach);
                    });
                });
            });

            namespace(server, "/stations", function () {
                /**
                 * @api {get} /monfiles/:idMonitoringFile/stations GetMonitoringFileStations
                 * @apiVersion 1.0.0
                 * @apiName GetMonitoringFileStations
                 * @apiGroup MonitoringFile
                 * @apiDescription Get the list of stations published by means MonitoringFile
                 *
                 * @apiExample {curl} Example usage:
                 *  curl -X GET http://server:port/api/v1/monfiles/1/stations
                 *
                 */
                server.get({
                    path: "/",
                    version: confRoutes.VERSION_1_0_0
                }, getMonitoringFileStations);

                namespace(server, "/:idMonitoring", function () {
                    /**
                     * @api {get} /monfiles/:idMonitoringFile/stations/:idMonitoring GetMonitoringFileStation
                     * @apiVersion 1.0.0
                     * @apiName GetMonitoringFileStation
                     * @apiGroup MonitoringFile
                     * @apiDescription Get station details for MonitoringFile (published module)
                     *
                     * @apiExample {curl} Example usage:
                     *  curl -X GET http://server:port/api/v1/monfiles/1/stations/1
                     *
                     */
                    server.get({
                        path: "/",
                        version: confRoutes.VERSION_1_0_0
                    }, getMonitoringFileStation);

                    /**
                     * @api {get} /monfiles/:idMonitoringFile/stations/:idMonitoring/measures GetMonitoringFileStationMeasures
                     * @apiVersion 1.0.0
                     * @apiName GetMonitoringFileStationMeasures
                     * @apiGroup MonitoringFile
                     * @apiDescription Get measures of station for MonitoringFile.<br><br>
                     * <b>Important</b>: Its necessary specify the "type" parameter into request.<br>
                     * Without it will be returned an error.<br>
                     * The useful values for "type" parameter can be retrieved from InfoStandard object<br><br>
                     * <i>infoStandard.sheetsMeasure.pgTableName</i><br><br>
                     * where InfoStandard object can be retrieved from following api<br><br>
                     * http://server:port/api/v1/infostds/:idInfStandardName/versions/:idInfStandard<br>
                     * <br>
                     * <br>
                     * Its possible to hide specify columns by means the "hidecolumns" parameter into request.<br>
                     * Without it will be returned all columns<br>
                     * <br>
                     * <br>
                     * @apiExample {curl} Example usage:
                     *  curl -X GET http://server:port/api/v1/monfiles/1/stations/1/measures?type=is1_Plancton_CD&hidecolumns=id,idMonitoring,NationalStationID
                     *
                     */
                    server.get({
                        path: "/measures",
                        version: confRoutes.VERSION_1_0_0
                    }, getMonitoringFileStationMeasures);
                });
            });
        });
    });

    function getMonitoringFiles(req, res, next) {
        let logMetadata = MODULE_NAME + "getMonitoringFiles";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        logger.log.debug("req.params: %s", JSON.stringify(req.params), logMetadata);
        logger.log.debug("paginate: %s", JSON.stringify(req.paginate), logMetadata);

        serviceMonitoringFile
            .getMonitoringFiles(req.params.filter, req.params.sort, req.paginate)
            .then(function (page) {
                logger.log.debug("page data      : %s", JSON.stringify(page.models), logMetadata);
                logger.log.debug("page pagination: %s", JSON.stringify(page.pagination), logMetadata);
                res.paginate.send(page.models, page.pagination.rowCount);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during Get MonitoringFile list."));
            });
    }

    function getMonitoringFile(req, res, next) {
        let logMetadata = MODULE_NAME + "getMonitoringFile";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }
        logger.log.debug("idMonitoringFile: -%d-", idMonitoringFile, logMetadata);

        serviceMonitoringFile.getMonitoringFile(idMonitoringFile)
            .then(function (mf) {
                logger.log.debug("MonitoringFile : %s", JSON.stringify(mf), logMetadata);
                if (mf) {
                    res.send(mf.toJSON());
                } else {
                    next(new restify.NotFoundError("Unknow MonitoringFile. Sorry !"));
                }
            })
            .catch(function (error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during Get MonitoringFile details."));
            });
    }

    function addMonitoringFile(req, res, next) {
        let logMetadata = MODULE_NAME + "addMonitoringFile";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === "") {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is("json") && !req.is("application/json")) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let params = {
            "idUser": inputJson.idUser,
            "idFileStatus": inputJson.idFileStatus,
            "idInformativeStandard": inputJson.idInformativeStandard,
            "name": inputJson.name || "-",
            "loadDate": moment().format("YYYY-MM-DD HH:mm:ss"),
            "acquisitionStartDate": inputJson.acquisitionStartDate,
            "acquisitionEndDate": inputJson.acquisitionEndDate,
            "fullpath": inputJson.fullpath || "-",
            "idRegion": inputJson.idRegion || null,
            "idCnr": inputJson.idCnr || null,
            "idArpa": inputJson.idArpa || null,
            "idAmp": inputJson.idAmp || null
        };

        serviceMonitoringFile.addMonitoringFile(params)
            .then(function (monitoringFile) {
                logger.log.debug("monitoringFile created : %s", JSON.stringify(monitoringFile.toJSON()), logMetadata);
                res.send(monitoringFile.toJSON());
            })
            .catch(function (error) {
                logger.log.error(error, logMetadata);
                next(new restify.InternalServerError("Problem during add monitoring file."));
            });
    }

    function updateMonitoringFile(req, res, next) {
        let logMetadata = MODULE_NAME + "updateMonitoringFile";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }
        logger.log.debug("idMonitoringFile: -%d-", idMonitoringFile, logMetadata);

        inputJson.idMonitoringFile = idMonitoringFile;
        let params = inputJson;

        serviceMonitoringFile.updateMonitoringFileAndManageWorkflow(params)
            .then(function (result) {
                logger.log.debug("MonitoringFile updated ? %s", result.updated, logMetadata);
                res.send(result.object);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                next(new restify.InternalServerError("Problem during update MonitoringFile."));
            });
    }

    function getMonitoringFileStations(req, res, next) {
        let logMetadata = MODULE_NAME + "GetMonitoringFileStations";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        logger.log.debug("req.params: %s", JSON.stringify(req.params), logMetadata);
        logger.log.debug("paginate: %s", JSON.stringify(req.paginate), logMetadata);

        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }
        logger.log.debug("idMonitoringFile: -%d-", idMonitoringFile, logMetadata);

        serviceMonitoringFile
            .getMonitoringFileStations(idMonitoringFile, req.params.filter, req.paginate)
            .then(function (stations) {
                /*
                  logger.log.debug("page data      : %s", JSON.stringify(page.models), logMetadata);
                  logger.log.debug("page pagination: %s", JSON.stringify(page.pagination), logMetadata);
                  res.paginate.send(page.models, page.pagination.rowCount);
                  */
                res.send(stations);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during Get MonitoringFile list."));
            });
    }

    function getMonitoringFileStation(req, res, next) {
        let logMetadata = MODULE_NAME + "GetMonitoringFileStation";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }
        logger.log.debug("idMonitoringFile: -%d-", idMonitoringFile, logMetadata);

        let idMonitoring = parseInt(req.params.idMonitoring, null);
        if (idMonitoring === undefined || idMonitoring === null) {
            next(new restify.BadRequestError("Invalid idMonitoring"));
        }
        logger.log.debug("idMonitoring: -%d-", idMonitoring, logMetadata);

        serviceMonitoringFile.getMonitoringFileStation(idMonitoringFile, idMonitoring)
            .then(function (station) {
                logger.log.debug("station : %s", JSON.stringify(station), logMetadata);
                if (station) {
                    res.send(station);
                } else {
                    next(new restify.NotFoundError("Unknow station. Sorry !"));
                }
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during Get station details."));
            });
    }

    function getMonitoringFileStationMeasures(req, res, next) {
        let logMetadata = MODULE_NAME + "getMonitoringFileStationMeasures";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        logger.log.debug("req.params: %s", JSON.stringify(req.params), logMetadata);

        let idMonitoring = parseInt(req.params.idMonitoring, null);
        if (idMonitoring === undefined || idMonitoring === null) {
            next(new restify.BadRequestError("Invalid idMonitoring"));
        }
        logger.log.debug("idMonitoring: -%d-", idMonitoring, logMetadata);

        let type = req.params.type;
        if (type === undefined || type === null) {
            next(new restify.BadRequestError("Invalid type"));
        }
        logger.log.debug("type: -%s-", type, logMetadata);

        let hidecolumns = req.params.hidecolumns;
        if (hidecolumns === undefined || hidecolumns === null) {
            hidecolumns = "";
        }
        logger.log.debug("hidecolumns: -%s-", hidecolumns, logMetadata);


        serviceMonitoringFile.getMonitoringFileStationMeasures(idMonitoring, type, hidecolumns)
            .then(function (measures) {
                logger.log.debug("measures num: %s", measures.length, logMetadata);
                res.send(measures);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during Get station measures."));
            });
    }

    function getMonitoringFileAttachs(req, res, next) {
        let logMetadata = MODULE_NAME + "getMonitoringFileAttachs";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        logger.log.debug("req.params: %s", JSON.stringify(req.params), logMetadata);
        logger.log.debug("paginate: %s", JSON.stringify(req.paginate), logMetadata);

        serviceMonitoringFile
            .getMonitoringFileAttachs()
            .then(function (collection) {
                logger.log.debug("MonitoringFileAttachs collection: %s", JSON.stringify(collection.toJSON()), logMetadata);
                res.send(collection.toJSON());
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during Get MonitoringFileAttachs list."));
            });
    }

    function addMonitoringFileAttach(req, res, next) {
        let logMetadata = MODULE_NAME + "AddMonitoringFileAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }
        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }
        logger.log.debug("idMonitoringFile: -%d-", idMonitoringFile, logMetadata);

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let attachParams = {
            "fullpath": inputJson.fullpath || "",
            "name": inputJson.name || "",
            "idMonitoringFile": idMonitoringFile
        };

        serviceMonitoringFile.addMonitoringFileAttach(attachParams)
            .then(function (attach) {
                logger.log.debug("attach created : %s", JSON.stringify(attach.toJSON()), logMetadata);
                res.send(attach.toJSON());
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during add attach."));
            });
    }

    function updateMonitoringFileAttach(req, res, next) {
        let logMetadata = MODULE_NAME + "UpdateMonitoringFileAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        if (!req.body || req.body === '') {
            next(new restify.BadRequestError("Invalid body"));
        }
        if (!req.is('json') && !req.is('application/json')) {
            next(new restify.BadRequestError("Invalid body. Must be a JSON"));
        }

        let inputJson = req.body;
        logger.log.debug("Body: %s", JSON.stringify(inputJson), logMetadata);

        let idMfAttachment = parseInt(req.params.idMfAttachment, null);
        if (idMfAttachment === undefined || idMfAttachment === null) {
            next(new restify.BadRequestError("Invalid idMfAttachment"));
        }
        logger.log.debug("idMfAttachment: -%d-", idMfAttachment, logMetadata);

        inputJson.idMfAttachment = idMfAttachment;
        let params = inputJson;
        /*
        let params = {
            "fullpath": inputJson.fullpath,
            "name": inputJson.name
        };
        */

        serviceMonitoringFile.updateMonitoringFileAttach(params)
            .then(function (attach) {
                logger.log.debug("attach updated : %s", JSON.stringify(attach.toJSON()), logMetadata);
                res.send(attach.toJSON());
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during update attach."));
            });
    }

    function deleteMonitoringFileAttach(req, res, next) {
        let logMetadata = MODULE_NAME + "DeleteMonitoringFileAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idMfAttachment = req.params.idMfAttachment;
        if (idMfAttachment === undefined || idMfAttachment === null) {
            next(new restify.BadRequestError("Invalid input (idMfAttachment)"));
        }
        logger.log.debug("idMfAttachment: %s", idMfAttachment, logMetadata);

        serviceMonitoringFile.removeMonitoringFileAttach(idMfAttachment)
            .then(function (msg) {
                logger.log.debug("Attach deleted", logMetadata);
                res.send(msg);
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Problem during delete attach from MonitoringFile. Error: " + err.detail));
            });
    }

    function uploadMonitoringFile(req, res, next) {
        let logMetadata = MODULE_NAME + "uploadMonitoringFile";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }

        if (req.files.file === undefined) {
            next(new restify.BadRequestError("No NonitoringFile uploaded"));
        }

        const rootDocRepository = configuration.docRepo.rootPath;
        const docRepository = rootDocRepository + path.sep + configuration.docRepo.monitoringFilesPath;
        logger.log.debug("docRepository: %s", docRepository, logMetadata);
        const filename = idMonitoringFile;
        logger.log.debug("idMonitoringFile: %s", filename, logMetadata);
        const extDownloadedFile = path.extname(req.files.file.name);

        //const attachsFolderIntoRepo = docRepository + path.sep + filename;
        //logger.log.debug("attachsFolderIntoRepo: %s", attachsFolderIntoRepo, logMetadata);
        //const filenameIntoRepo = docRepository + path.sep + filename + extDownloadedFile;
        //logger.log.debug("filenameIntoRepo: %s", filenameIntoRepo, logMetadata);



        logger.log.debug("Uploaded file: %s [%d b] (type: %s)", req.files.file.name, req.files.file.size, req.files.file.type, logMetadata);

        const tempFile = req.files.file.path;
        logger.log.debug("Temp file: %s", tempFile, logMetadata);


        //TODO: MEGA REFACTORING
        fsUtil.existFile(tempFile)
            .then(function (exist) {
                logger.log.debug(exist ? "Temp file exist" : "Temp file doesn't exist", logMetadata);
                if (exist) {
                    serviceMonitoringFile.getMonitoringFile(idMonitoringFile)
                        .then(function (mf) {
                            let oldFileToRemove = rootDocRepository + path.sep + mf.get("fullpath");
                            if (fsUtil.removeFileSync(oldFileToRemove)) {
                                logger.log.debug("Old file <%s> removed", oldFileToRemove, logMetadata);
                            } else {
                                logger.log.error("Problem during removing lod file <%s>", oldFileToRemove, logMetadata);
                            }
                            //utilizzo uuid per salvare il file nel repository su filesystem
                            const filenameIntoRepo = docRepository + path.sep + mf.get("uuid") + extDownloadedFile;
                            logger.log.debug("filenameIntoRepo: %s", filenameIntoRepo, logMetadata);                        
                            fsUtil.copyFile(tempFile, filenameIntoRepo)
                                .then(function (result) {
                                    logger.log.debug(result ? "Temp file copied into doc repo" : "Temp file not copied into doc repo", logMetadata);
                                    if (result) {
                                        //utilizzo uuid per creare la cartella degli allegati nel repository su filesystem
                                        const attachsFolderIntoRepo = docRepository + path.sep + mf.get("uuid");
                                        logger.log.debug("attachsFolderIntoRepo: %s", attachsFolderIntoRepo, logMetadata);
                                        fsUtil.mkdir(attachsFolderIntoRepo)
                                            .then(function (result) {
                                                logger.log.debug(result ? "Attachs folder created" : "Attachs folder not created", logMetadata);
                                                if (result) {
                                                    const inputJson = {
                                                        idMonitoringFile: idMonitoringFile
                                                    };
                                                    inputJson.fullpath = filenameIntoRepo.replace(rootDocRepository + path.sep, "");
                                                    inputJson.name = req.files.file.name;
                                                    serviceMonitoringFile.updateMonitoringFile(inputJson)
                                                        .then(function (mf) {
                                                            logger.log.debug("MonitoringFile updated : %s", JSON.stringify(mf.toJSON()), logMetadata);
                                                            res.send(mf.toJSON());
                                                        })
                                                        .catch(function (err) {
                                                            logger.log.error(err, logMetadata);
                                                            next(new restify.InternalServerError("Problem during update MonitoringFile."));
                                                        });
                                                } else {
                                                    next(new restify.InternalServerError("Problem during creating Attachs folder"));
                                                }
                                            })
                                            .catch(function (err) {
                                                logger.log.error(err, logMetadata);
                                                logger.log.error(err.stack, logMetadata);
                                                next(new restify.InternalServerError("Problem during creating Attachs folder"));
                                            });
                                    } else {
                                        next(new restify.InternalServerError("Problem during moving downloaded file into doc repository"));
                                    }
                                })
                                .catch(function (err) {
                                    logger.log.error(err, logMetadata);
                                    logger.log.error(err.stack, logMetadata);
                                    next(new restify.InternalServerError("Problem during moving downloaded file into doc repository"));
                                });
                        })
                        .catch(function (err) {
                            logger.log.error("Problem during read MonitoringFile. Error: %s", JSON.stringify(err), logMetadata);
                            logger.log.error(err.stack, logMetadata);
                            next(new restify.InternalServerError("Problem during read MonitoringFile."));
                        });
                } else {
                    next(new restify.InternalServerError("Downloaded temp file is missing"));
                }
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Downloaded temp file is missing"));
            });
    }

    function uploadMonitoringFileAttach(req, res, next) {
        let logMetadata = MODULE_NAME + "uploadMonitoringFileAttach";
        logger.log.debug(logger.utils.dividerDots, logMetadata);

        let idMonitoringFile = parseInt(req.params.idMonitoringFile, null);
        if (idMonitoringFile === undefined || idMonitoringFile === null) {
            next(new restify.BadRequestError("Invalid idMonitoringFile"));
        }
        logger.log.debug("idMonitoringFile: %d", idMonitoringFile, logMetadata);

        let idMfAttachment = parseInt(req.params.idMfAttachment, null);
        if (idMfAttachment === undefined || idMfAttachment === null) {
            next(new restify.BadRequestError("Invalid idMfAttachment"));
        }
        logger.log.debug("idMfAttachment: %d", idMfAttachment, logMetadata);

        if (req.files.file === undefined) {
            next(new restify.BadRequestError("No Attach uploaded"));
        }

        const rootDocRepository = configuration.docRepo.rootPath;
        /*const attachsFolderIntoRepo = rootDocRepository + path.sep + configuration.docRepo.monitoringFilesPath + path.sep + idMonitoringFile;
        logger.log.debug("attachsFolderIntoRepo: %s", attachsFolderIntoRepo, logMetadata);
        const filename = idMfAttachment;
        logger.log.debug("idMfAttachment: %s", filename, logMetadata);
        const extDownloadedFile = path.extname(req.files.file.name);

        const filenameIntoRepo = attachsFolderIntoRepo + path.sep + filename + extDownloadedFile;
        logger.log.debug("filenameIntoRepo: %s", filenameIntoRepo, logMetadata);*/

        logger.log.debug("Uploaded file: %s [%d b] (type: %s)", req.files.file.name, req.files.file.size, req.files.file.type, logMetadata);

        const tempFile = req.files.file.path;
        logger.log.debug("Temp file: %s", tempFile, logMetadata);

        //TODO: REFACTORING: use promise
        fsUtil.existFile(tempFile)
            .then(function (exist) {
                logger.log.debug(exist ? "Temp file exist" : "Temp file doesn't exist", logMetadata);
                if (exist) {
                    //prendo uuid del monitoring file
                    serviceMonitoringFile.getMonitoringFile(idMonitoringFile)
                        .then(function (mf) {
                            let uuidMonitoringFile = mf.get("uuid");   
                            logger.log.error("uuid monitoringFile: %s", uuidMonitoringFile, logMetadata);
                            serviceMonitoringFile.getMonitoringFileAttach(idMfAttachment)
                                .then(function (mfAttach) {
                                    let oldFileToRemove = rootDocRepository + path.sep + mfAttach.get("fullpath");
                                    if (fsUtil.removeFileSync(oldFileToRemove)) {
                                        logger.log.debug("Old file <%s> removed", oldFileToRemove, logMetadata);
                                    } else {
                                        logger.log.error("Problem during removing lod file <%s>", oldFileToRemove, logMetadata);
                                    }                            
                                    const attachsFolderIntoRepo = rootDocRepository + path.sep + configuration.docRepo.monitoringFilesPath + path.sep + uuidMonitoringFile;
                                    logger.log.debug("attachsFolderIntoRepo: %s", attachsFolderIntoRepo, logMetadata);
                                    const filename = mfAttach.get("uuid");
                                    logger.log.debug("idMfAttachment: %s", filename, logMetadata);
                                    const extDownloadedFile = path.extname(req.files.file.name);

                                    const filenameIntoRepo = attachsFolderIntoRepo + path.sep + filename + extDownloadedFile;
                                    logger.log.debug("filenameIntoRepo: %s", filenameIntoRepo, logMetadata);

                                    fsUtil.copyFile(tempFile, filenameIntoRepo)
                                        .then(function (result) {
                                            logger.log.debug(result ? "Temp file copied into doc repo" : "Temp file not copied into doc repo", logMetadata);
                                            if (result) {
                                                const inputJson = {
                                                    idMfAttachment: idMfAttachment
                                                };
                                                inputJson.fullpath = filenameIntoRepo.replace(rootDocRepository + path.sep, "");
                                                inputJson.name = req.files.file.name;
                                                serviceMonitoringFile.updateMonitoringFileAttach(inputJson)
                                                    .then(function (mfAttach) {
                                                        logger.log.debug("MonitoringFile updated : %s", JSON.stringify(mfAttach.toJSON()), logMetadata);
                                                        res.send(mfAttach.toJSON());
                                                    })
                                                    .catch(function (err) {
                                                        logger.log.error(err, logMetadata);
                                                        next(new restify.InternalServerError("Problem during update MonitoringFileAttach."));
                                                    });
                                            } else {
                                                next(new restify.InternalServerError("Problem during moving downloaded file into doc repository"));
                                            }
                                        })
                                        .catch(function (err) {
                                            logger.log.error(err, logMetadata);
                                            logger.log.error(err.stack, logMetadata);
                                            next(new restify.InternalServerError("Problem during moving downloaded file into doc repository"));
                                        });
                                })
                                .catch(function (err) {
                                    logger.log.error("Problem during read MonitoringFileAttach. Error: %s", JSON.stringify(err), logMetadata);
                                    logger.log.error(err.stack, logMetadata);
                                    next(new restify.InternalServerError("Problem during read MonitoringFile."));
                                });                            
                            })
                        .catch(function (err) {
                            logger.log.error("Problem during read MonitoringFile. Error: %s", JSON.stringify(err), logMetadata);
                            logger.log.error(err.stack, logMetadata);
                            next(new restify.InternalServerError("Problem during read MonitoringFile."));
                        });     

                } else {
                    next(new restify.InternalServerError("Downloaded temp file is missing"));
                }
            })
            .catch(function (err) {
                logger.log.error(err, logMetadata);
                logger.log.error(err.stack, logMetadata);
                next(new restify.InternalServerError("Downloaded temp file is missing"));
            });
    }
};



module.exports = routes;