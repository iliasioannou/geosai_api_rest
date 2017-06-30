"use strict";
let repoUser = require('../repositories/users');
let repoUserRegion = require('../repositories/userRegions');

let logger = require("../utils/log");
let chalk = require('chalk');
let logMetadata = {
    module: "services.userRegions",
    method: ""
};


/**
 * Get User's regions list
 */
let getUserRegions = function(idUser) {
    logMetadata.method = "GetUserRegions";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idUser: -%s-", idUser, logMetadata);

    return repoUserRegion.UserRegion
        .forge()
        .query({
            where: {
                idUser: idUser
            }
        })
        .fetchAll({
            withRelated: ["region"]
        });
}


/**
 * Add Region to User
 */
let addRegionToUser = function(userRegionParams) {
    logMetadata.method = "addRegionToUser";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: -%s-", JSON.stringify(userRegionParams), logMetadata);

    return new Promise(function(resolve, reject) {
        new repoUserRegion.UserRegion(userRegionParams)
            .save()
            .then(function(userRegion) {
                logger.log.debug("Region added to User: %d", userRegion.iduserregion, logMetadata);
                resolve(userRegion);
            }).catch(function(err) {
                reject(err);
            });
    });
}

/**
 * Remove Region to User
 */
let removeRegionFromUser = function(idUserRegion) {
    logMetadata.method = "removeRegionFromUser";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idUserRegion: -%d-", idUserRegion, logMetadata);

    return new Promise(function(resolve, reject) {
        new repoUserRegion.UserRegion({
            idUserRegion: idUserRegion
        }).destroy().then(function() {
            logger.log.debug("Region removed from User", logMetadata);
            resolve("Region removed from User");
        }).catch(function(err) {
            reject(err);
        });
    });
}

/**
 * Remove all Region from User
 */
let removeAllRegionFromUser = function(idUser) {
    logMetadata.method = "removeAllRegionFromUser";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idUser: -%d-", idUser, logMetadata);

    return new Promise(function(resolve, reject) {
        getUserRegions(idUser)
            .then(function(userRegions) {
                if (userRegions) {
                    userRegions.invokeThen("destroy").then(function() {
                        logger.log.debug("All Region have been removed from User", logMetadata);
                        resolve("All Region have been removed from User");
                    }).catch(function(err) {
                        logger.log.error("Problem removing  region from user", err, logMetadata);
                        reject(err);
                    });
                }
                else {
                    resolve("User without regions");
                }
            })
            .catch(function(err) {
                logger.log.error("Problem reading region from user", err, logMetadata);
                reject(err);
            });
    });
}

// Public
let pub = {
    getUserRegions: getUserRegions,
    addRegionToUser: addRegionToUser,
    removeRegionFromUser: removeRegionFromUser,
    removeAllRegionFromUser: removeAllRegionFromUser
}

module.exports = pub
