"use strict";
let bookshelf = require("./base");
// let roles = require("./roles.js")
// let permissions = require("./permissions.js")

// ------------ privilege -------------
let Privilege = bookshelf.bookshelf.Model.extend({
    tableName: "privileges",
    idAttribute: "idPrivilege"
        // ,
        // roles: function() {
        //     return this.belongsToMany(roles.Role, "idprivilege").through(permission.Permission);
        // }
});

let Privileges = bookshelf.bookshelf.Collection.extend({
    model: Privilege
});



// Public
let pub = {
    Privilege: bookshelf.bookshelf.model("Privilege", Privilege),
    Privileges: bookshelf.bookshelf.collection("Privileges", Privileges)
};

module.exports = pub;
