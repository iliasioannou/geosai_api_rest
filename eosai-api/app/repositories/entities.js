"use strict";
let bookshelf = require("./base");
require("./users")

// ------------ Organization Type -------------

let OrgType = bookshelf.bookshelf.Model.extend({
    tableName: "organizationTypes",
    idAttribute: "idOrganizationType",
    users: function() {
        return this.hasMany("User", "iduser");
    }

});

let OrgTypes = bookshelf.bookshelf.Collection.extend({
    model: OrgType
});


// ------------ region -------------

let Region = bookshelf.bookshelf.Model.extend({
    tableName: "regions",
    idAttribute: "idRegion",
    users: function() {
        return this.hasMany("User", "idUser");
    }

});

let Regions = bookshelf.bookshelf.Collection.extend({
    model: Region
});

// ------------ cnr -------------

let Cnr = bookshelf.bookshelf.Model.extend({
    tableName: "cnr",
    idAttribute: "idCnr",

});

let Cnrs = bookshelf.bookshelf.Collection.extend({
    model: Cnr
});

// ------------ arpa -------------

let Arpa = bookshelf.bookshelf.Model.extend({
    tableName: "arpa",
    idAttribute: "idArpa",

});

let Arpas = bookshelf.bookshelf.Collection.extend({
    model: Arpa
});

// ------------ amp -------------

let Amp = bookshelf.bookshelf.Model.extend({
    tableName: "amp",
    idAttribute: "idAmp",

});

let Amps = bookshelf.bookshelf.Collection.extend({
    model: Amp
});

// Public
let pub = {
    OrgType: bookshelf.bookshelf.model("OrgType", OrgType),
    OrgTypes: bookshelf.bookshelf.collection("OrgTypes", OrgTypes),
    Region: bookshelf.bookshelf.model("Region", Region),
    Regions: bookshelf.bookshelf.collection("Regions", Regions),
    Cnr: bookshelf.bookshelf.model("Cnr", Cnr),
    Cnrs: bookshelf.bookshelf.collection("Cnrs", Cnrs),
    Arpa: bookshelf.bookshelf.model("Arpa", Arpa),
    Arpas: bookshelf.bookshelf.collection("Arpas", Arpas),
    Amp: bookshelf.bookshelf.model("Amp", Amp),
    Amps: bookshelf.bookshelf.collection("Amps", Amps)
}

module.exports = pub;
