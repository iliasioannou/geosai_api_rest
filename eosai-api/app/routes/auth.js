/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";
const routes = function (server) {
    const namespace = require("restify-namespace");
    const restify = require("restify");
    const confRoutes = require("./config");
    const authHooks = require("../utils/authHooks");

    const PATH = "/oauth";
    namespace(server, PATH, function () {
        server.get({
            path: "/logout",
            version: confRoutes.VERSION_1_0_0
        }, function(req, res){
            var credentials = req.authorization.credentials;
            if(credentials){
                authHooks.deleteToken(credentials);
            }
            res.status(204);
            res.end();    
            
        });
    });
};



module.exports = routes;