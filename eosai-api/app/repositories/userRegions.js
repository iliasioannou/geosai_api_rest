"use strict";
let bookshelf = require("./base");
require("./users");
require("./entities");


// ------------ grant privileges to role (permissions) -------------
let UserRegion = bookshelf.bookshelf.Model.extend({
    tableName: "usersRegions",
    idAttribute: "idUserRegion",
    //hidden: ["idUser", "idRegion"],
    user: function() {
        return this.belongsTo("User", "idUser");
    },
    region: function() {
        return this.belongsTo("Region", "idRegion");
    }
});

let UserRegions = bookshelf.bookshelf.Collection.extend({
    model: UserRegion
});


// Public
let pub = {
    UserRegion: bookshelf.bookshelf.model("UserRegion", UserRegion),
    UserRegions: bookshelf.bookshelf.collection("UserRegions", UserRegions)
};


module.exports = pub;
