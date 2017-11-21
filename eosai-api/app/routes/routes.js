"use strict";

var routes = function(server) {
    console.log("\tConfigure Base routes");
    require("./base.js")(server);

    console.log("\tConfigure User routes");
    require("./users.js")(server);

    console.log("\tConfigure Roles routes");
    require("./roles.js")(server);

    console.log("\tConfigure Privileges routes");
    require("./privileges.js")(server);

    console.log("\tConfigure Entities routes");
    require("./entities.js")(server);

    console.log("\tConfigure Permissions routes");
    require("./permissions.js")(server);

    console.log("\tConfigure Informative Standard routes");
    require("./informativeStandard.js")(server);

    console.log("\tConfigure Monitoring File routes");
    require("./monitoringFile.js")(server);

    console.log("\tConfigure Monitoring File Status routes");
    require("./monitoringFileStatus.js")(server);

    console.log("\tConfigure Auth routes");
    require("./auth.js")(server);

    console.log("\tConfigure Processing routes");
    require("./processings.js")(server);

}

module.exports = routes;
