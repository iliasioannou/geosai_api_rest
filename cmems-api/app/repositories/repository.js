"use strict";
let userRepo = require("./users");
let roleRepo = require("./roles");


// Public
let pub = {
    UserRepo: userRepo,
    RoleRepo: roleRepo
}

module.exports = pub;
