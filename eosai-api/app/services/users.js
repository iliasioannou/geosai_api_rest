"use strict";
let repoUser = require('../repositories/users');
let repoUserRegion = require('../repositories/userRegions');

let logger = require("../utils/log");
let chalk = require('chalk');

let logMetadata = {
    module: "services.user",
    method: ""
};

let login = function(user) {
    logMetadata.method = "login";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("User: %s", JSON.stringify(user));

    return new Promise(function(resolve, reject) {
        getUserByUsername(user.username)
            .then(function(userDb) {
                if (userDb) {
                    logger.log.debug("User: <%s>", JSON.stringify(userDb), logMetadata);
                    if (userDb.get("password") !== user.password) {
                        logger.log.debug("Wrong password <%s> for user <%s>", user.password, user.username, logMetadata);
                        reject("Wrong password");
                    }
                    else if (userDb.get("active") !== 1) {
                        logger.log.debug("The user <%s> is not active", user.username, logMetadata);
                        reject("User doesn't active");
                    }
                    else {
                        resolve(userDb);
                    }
                }
                else {
                    logger.log.debug("User <%s> not exits", user.username, logMetadata);
                    reject("User doesn't exits");
                }
            })
            .catch(function(err) {
                logger.log.debug(err);
                reject("Problem during check User for login");
            });
    });
};


/**
 * Return list of users
 */
let getUsers = function() {
    logMetadata.method = "getUsers";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    return repoUser.User.forge()
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll({
            withRelated: ["role"]
        });
}


/**
 * Add user
 */
let addUser = function(userParams) {
    logMetadata.method = "addUser";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(userParams), logMetadata);

    return new Promise(function(resolve, reject) {
        let username = userParams.username;
        logger.log.debug("username = -%s-", username, logMetadata);
        let exist = false;
        existUser(username)
            .then(function(exist) {
                logger.log.debug("Username -%s- exist ? %s", username, (exist ? "Y" : "N"), logMetadata);
                if (exist) {
                    reject("Already exist user with same username");
                }
                else {
                    new repoUser.User(userParams)
                        .save()
                        .then(function(user) {
                            logger.log.debug("User added: %d", user.idUser, logMetadata);
                            resolve(user);
                        }).catch(function(err) {
                            reject(err);
                        });
                }
            })
            .catch(function(error) {
                logger.log.error("Problem during read from DB: %s", error, logMetadata);
                reject(error);
            });
    });
}


/**
 * Update user
 */
let updateUser = function(userParams) {
    logMetadata.method = "updateUser";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("input: %s", JSON.stringify(userParams), logMetadata);

    return new Promise(function(resolve, reject) {
        let idUser = userParams.idUser;
        if (idUser == undefined || idUser == null) {
            reject("Empty idUser");
            return;
        };

        new repoUser.User({
                idUser: userParams.idUser
            })
            .fetch()
            .then(function(userFetched) {
                logger.log.debug("User fetched: %s", JSON.stringify(userFetched), logMetadata);
                userFetched.save(userParams, {
                        patch: true
                    })
                    .then(function(user) {
                        logger.log.debug("User update: %s", JSON.stringify(user), logMetadata);
                        resolve(user);
                    }).catch(function(err) {
                        logger.log.error("Problem during user update. Error: %s", JSON.stringify(err), logMetadata);
                        reject(err);
                    });
            }).catch(function(err) {
                logger.log.error("Problem during user fetch. Error: %s", JSON.stringify(err), logMetadata);
                reject(err);
            });
    });
}

/**
 * Return list users of the region
 */
let getUsersForRegion = function(idRegion) {
    logMetadata.method = "getUsersForRegion";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repoUser.User.forge()
        .query({
            where: {
                idRegion: idRegion
            }
        })
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}


/**
 * Return list users of the organization types
 */
let getUsersForOrgTypes = function(idOrgType) {
    logMetadata.method = "getUsersForOrgTypes";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repoUser.User.forge()
        .query({
            where: {
                idOrganizationType: idOrgType
            }
        })
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}

/**
 * Return list users of Cnr
 */
let getUsersForCnr = function(idCnr) {
    logMetadata.method = "getUsersForCnr";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repoUser.User.forge()
        .query({
            where: {
                idCnr: idCnr
            }
        })
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}

/**
 * Return list users of Amp
 */
let getUsersForAmp = function(idAmp) {
    logMetadata.method = "getUsersForAmp";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    return repoUser.User.forge()
        .query({
            where: {
                idAmp: idAmp
            }
        })
        .query(function queryBuilder(qb) {
            qb.orderBy("name", "asc");
        })
        .fetchAll();
}

/**
 * Return user by username
 */
let getUserByUsername = function(username) {
    logMetadata.method = "getUserByUsername";
    logger.log.debug(logger.utils.dividerDots, logMetadata);

    if (username == undefined || username == null) {
        return null;
    }
    logger.log.debug("\tusername: -%s-", username, logMetadata);

    return repoUser.User.forge({
            username: username
        })
        .fetch({
            withRelated: ["role"]
        });
}


/**
 * Return user by id
 */
let getUserById = function(idUser) {
    logMetadata.method = "getUserById";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("idUser: -%s-", idUser, logMetadata);

    return repoUser.User.forge({
            idUser: idUser
        })
        .fetch({
            withRelated: ["role"]
        });
}

/**
 * Check if user exist by username
 */
let existUser = function(username) {
    logMetadata.method = "existUser";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("username: -%s-", username, logMetadata);

    return new Promise(function(resolve, reject) {
        var exist = false;
        getUserByUsername(username)
            .then(function(user) {
                exist = (user);
                logger.log.debug("User -%s- exist ? %s", username, (exist ? "Y" : "N"), logMetadata);
                resolve(exist);
            })
            .catch(function(error) {
                logger.log.error("Problem during read from DB: %s", error);
                reject(error);
            });
    });
}



// Public
let pub = {
    login: login,
    getUsers: getUsers,
    addUser: addUser,
    updateUser: updateUser,
    getUsersForRegion: getUsersForRegion,
    getUsersForCnr: getUsersForCnr,
    getUsersForAmp: getUsersForAmp,
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    existUser: existUser
}

module.exports = pub
