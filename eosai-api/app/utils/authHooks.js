"use strict";

var _ = require("underscore");
var crypto = require("crypto");
var users = require("../services/users");
var util = require("./util");
var moment = require("moment");

// store user data in memory along with clientId and clientSecret params
// store the tokens map
var database = {
    clients: {
        cmemsClient: { secret: "INsb0skEFM" },
    },
    tokensToUsernames: {}
};


/**
Generate a new token valid for next requests.
**/
function generateToken(data) {
    var random = Math.floor(Math.random() * 100001);
    var timestamp = (new Date()).getTime();
    var sha256 = crypto.createHmac("sha256", random + "WOO" + timestamp);

    return sha256.update(data).digest("base64");
}

/**
Validate provided clientId and clientSecret params, as stored in the database var.
**/
exports.validateClient = function (credentials, req, cb) {
    var isValid = _.has(database.clients, credentials.clientId) &&
                  database.clients[credentials.clientId].secret === credentials.clientSecret;
    cb(null, isValid);
};

/**
Check provided user credentials.
If they're correct, create and return the auth token.
Otherwise, mark the auth flow as failed.
**/
exports.grantUserToken = function (credentials, req, cb) {
    users.login({'username': credentials.username, 'password': credentials.password})
        .then(function(result){

            var token = generateToken(credentials.username + ":" + credentials.password);
            console.log("AAAA", token);
            database.tokensToUsernames[token]= {
                "username": credentials.username,
                "expireTime": moment().add(60*60*2, 'seconds')
            };
            console.log("DB", database);
            return cb(null, token);
    }).catch(function(result){
        return cb(null, false);
    });
};

/**
Authenticate provided token.
This methods looks up the token in the tokens map
and authenticate the client if provided token is found;
otherwise the auth fail.
**/
exports.authenticateToken = function (token, req, cb) {
    if (_.has(database.tokensToUsernames, token)) {
        // If the token authenticates, set the corresponding property on the request, and call back with `true`.
        // The routes can now use these properties to check if the request is authorized and authenticated.
        var userData = database.tokensToUsernames[token];
        console.log("ES ", userData.expireTime);
        console.log("NOW ", moment());
        console.log(moment().isBefore(userData.expireTime));
        if(moment().isBefore(userData.expireTime)){
            req.username = userData.username;
            return cb(null, true);
        }
    }

    // If the token does not authenticate, call back with `false` to signal that.
    // Calling back with an error would be reserved for internal server error situations.
    cb(null, false);
};

exports.deleteToken = function(token){
    if (_.has(database.tokensToUsernames, token)) {
        delete database.tokensToUsernames[token];
    }
}
