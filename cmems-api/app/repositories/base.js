"use strict";
let dbConfig = require("../config/dbConfig.js");
let knex = require("knex")(dbConfig);
let bookshelf = require("bookshelf")(knex);

// Pass an initialized bookshelf instance
let modelBase = require("bookshelf-modelbase")(bookshelf);
// Or initialize as a bookshelf plugin
//bookshelf.plugin(require("bookshelf-modelbase").pluggable);


bookshelf.plugin(require("./pagination/index.js"));
bookshelf.plugin("visibility");
bookshelf.plugin("virtuals");
bookshelf.plugin("registry");

// Public
let pub = {
    bookshelf: bookshelf,
    modelBase: modelBase
}

module.exports = pub;
