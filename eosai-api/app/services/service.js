"use strict";

let userService = require("./users");
let roleService = require("./roles");
let entityService = require("./entities");
let privilegeService = require("./privileges");
let permissionService = require("./permissions");


// Public
let pub = {
    UserService: userService,
    RoleService: roleService,
    EntityService: entityService,
    PrivilegeService: privilegeService,
    PermissionService: permissionService
}

module.exports = pub;
