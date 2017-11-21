"use strict";
var dbConfig = {
    client: "postgres",
    debug: true,
    connection: {
        host: "___config.database.host___",
        user: "___config.database.user___",
        password: "___config.database.password___",
        database: "___config.database.name___",
        charset: "utf8",
        timezone: "UTC"
    }
};

module.exports = dbConfig;
