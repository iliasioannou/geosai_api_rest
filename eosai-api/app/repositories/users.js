"use strict";
let bookshelf = require("./base");
let extend = require("xtend");
let _ = require('lodash');
let logger = require("../utils/log");


require("./entities");
require("./roles");
require("./userRegions");

let logMetadata = {
    module: "repositories.users",
    method: ""
};

// ------------ Users -------------

let User = bookshelf.bookshelf.Model.extend({
    tableName: "users",
    //hidden: ["password", "idRole", "idRegion", "idArpa", "idAmp", "idCnr", "idOrganizationType"],
    idAttribute: "idUser",
    toJSON: function(options) {
        return bookshelf.bookshelf.Model.prototype.toJSON.call(this, extend(options || {}, {
            omitPivot: true
        }));
    },
    role: function() {
        return this.belongsTo("Role", "idRole");
    },
    ownRegion: function() {
        logMetadata.method = "ownRegion";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        return this
            .belongsToMany("Region")
            .through("UserRegion", "idUser", "idRegion")
            .query({
                where: {
                    isDefault: 1
                }
            })
    },
    otherRegions: function() {
        return this
            .belongsToMany("Region")
            .through("UserRegion", "idUser", "idRegion")
            .query({
                where: {
                    isDefault: 0
                }
            })
    },

});


let Users = bookshelf.bookshelf.Collection.extend({
    model: User
});



// Public
let pub = {
    User: bookshelf.bookshelf.model("User", User),
    Users: bookshelf.bookshelf.collection("Users", Users)
}

module.exports = pub;
