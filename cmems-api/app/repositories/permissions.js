"use strict";
let bookshelf = require("./base.js");
require("./roles");
require("./privileges");


// ------------ grant privileges to role (permissions) -------------
let Permission = bookshelf.bookshelf.Model.extend({
    tableName: "rolesPrivileges",
    idAttribute: "idRolePrivilege",
    role: function() {
        return this.belongsTo("Role", "idRole");
    },
    privilege: function() {
        return this.belongsTo("Privilege", "idPrivilege");
    }
});

let Permissions = bookshelf.bookshelf.Collection.extend({
    model: Permission
});



// Public
let pub = {
    Permission: bookshelf.bookshelf.model("Permission", Permission),
    Permissions: bookshelf.bookshelf.collection("Permissions", Permissions)
};


module.exports = pub;
