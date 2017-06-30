/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";
const config = {
    server: {
        name: "___config.server.name___",
        version: "___config.server.version___",
        buildDate: "___config.server.buildDate___",
        portHttp: ___config.server.portHttp___,
        portHttps: ___config.server.portHttps___,
        maxBodySize: 10485760
    },
    api: {
        name: "ISPRA - Api Rest",
        version: "___config.api.version___",
        prefix: "api",
        apidoc: "apidoc",
        paginate: {
            paramsNames: {
                page: "page",
                per_page: "per_page"
            },
            defaults: {
                page: 1,
                per_page: 500
            },
            numbersOnly: true,
            hostname: true
        }
    },
    docRepo:{
        rootPath: "___config.api.rootDocRepository___",
        monitoringFilesPath: "pkz019_SIC_Repository/monitoringfiles",
        infoStandardFilesPath: "pkz019_SIC_Repository/informativestandard"
    },    
    workflowModule:{
        stateCompliant: "compliant",
        stateValid: "valid",
        statePublic: "public",
        idStateNotCompliant: 4,
    },
    validationModule:{
        suffixValidationResult: "_VALIDATION"
    }

};

module.exports = config;
