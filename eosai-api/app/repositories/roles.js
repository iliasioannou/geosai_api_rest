"use strict";
let bookshelf = require("./base");
let extend = require("xtend");

require("./privileges");
require("./permissions");

// let privileges = require("./privileges.js");
// let permissions = require("./permissions.js")



// ------------ Roles -------------

let Role = bookshelf.bookshelf.Model.extend({
    tableName: "roles",
    idAttribute: "idRole",
    //hidden: ["id", "seller_id", "user_id", "geom"],
    toJSON: function(options) {
        return bookshelf.bookshelf.Model.prototype.toJSON.call(this, extend(options || {}, {
            omitPivot: true
        }));
    },
    privileges: function() {
        return this.belongsToMany("Privilege", "rolesPrivileges", "idRole", "idPrivilege");
    }
});


let Roles = bookshelf.bookshelf.Collection.extend({
    model: Role
});


// Public
let pub = {
    Role: bookshelf.bookshelf.model("Role", Role),
    Roles: bookshelf.bookshelf.collection("Roles", Roles)
};


module.exports = pub;
