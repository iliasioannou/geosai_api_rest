"use strict";
let bookshelf = require("./base");
let logger = require("../utils/log");
//let extend = require("xtend");

let logMetadata = {
    module: "repository.informativeStandard",
    method: ""
};

// ------------ Informative Standard Name -------------

//let InfoStandardName = bookshelf.modelBase.extend({
let InfoStandardName = bookshelf.bookshelf.Model.extend({
    tableName: "infStandardNames",
    //hidden: ["idInfStandardName"],
    idAttribute: "idInfStandardName",
    infoStandards: function() {
        logMetadata.method = "InfoStandardName.infoStandards";
        logMetadata.method = "InfoStandardName.infoStandards";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        let infoStandardVersions = this.hasMany("InfoStandard", "idInfStandardName")
            .query(function(qb) {
                qb.orderBy("version", "desc");
                logger.log.debug("qb: %s", qb, logMetadata);
            });
        logger.log.debug("infoStandardVersions: collection: %s", JSON.stringify(infoStandardVersions.toJSON()), logMetadata);
        return infoStandardVersions;
    }
})

let InfoStandardNames = bookshelf.bookshelf.Collection.extend({
    model: InfoStandardName
});

// ------------ Informative Standard  -------------

//let InfoStandard = bookshelf.modelBase.extend({
let InfoStandard = bookshelf.bookshelf.Model.extend({
    tableName: "informativesStandards",
    //hidden: ["idInfStandardName"],
    idAttribute: "idInformativeStandard",
    //hasTimestamps: false,
    hasTimestamps: ["creationDate", "creationDate"],
    infoStandardName: function() {
        return this.belongsTo("InfoStandardName", "idInfStandardName");
    },
    attachs: function() {
        return this.hasMany("InfoStandardAttach", this.idAttribute);
    },
    sheets: function() {
        return this.hasMany("InfoStandardSheet", this.idAttribute);
    },
    sheetsMeasure: function() {
        return this.sheets().query(function(qb) {
            qb.where({
                isMeasure: 1
            })
        })
    },
    sheetStation: function() {
        return this.sheets().query(function(qb) {
            qb.where({
                isMeasure: 0
            })
        })
    }

});


let InfoStandards = bookshelf.bookshelf.Collection.extend({
    model: InfoStandard
});

// ------------ Informative Standard Sheet -------------

let InfoStandardSheet = bookshelf.bookshelf.Model.extend({
    tableName: "infStandardSheets",
    //hidden: ["idInfStandard"],
    idAttribute: "idisSheet",
    hasTimestamps: false,
    //hasTimestamps: ["creationDate", "creationDate"],

    infoStandard: function() {
        return this.belongsTo("InfoStandard", "idInformativeStandard");
    }
});


let InfoStandardSheets = bookshelf.bookshelf.Collection.extend({
    model: InfoStandardSheet
});

// ------------ Informative Standard Attach -------------

//let InfoStandardAttach = bookshelf.modelBase.extend({
let InfoStandardAttach = bookshelf.bookshelf.Model.extend({
    tableName: "infStandardAttachments",
    //hidden: ["idInfStandard"],
    idAttribute: "idIsAttachment",
    hasTimestamps: false,
    //hasTimestamps: ["creationDate", "creationDate"],

    infoStandard: function() {
        return this.belongsTo("InfoStandard", "idInformativeStandard");
    }
});


let InfoStandardAttachs = bookshelf.bookshelf.Collection.extend({
    model: InfoStandardAttach
});



// Public
let pub = {
    InfoStandardName: bookshelf.bookshelf.model("InfoStandardName", InfoStandardName),
    InfoStandardNames: bookshelf.bookshelf.collection("InfoStandardNames", InfoStandardNames),
    InfoStandard: bookshelf.bookshelf.model("InfoStandard", InfoStandard),
    InfoStandards: bookshelf.bookshelf.collection("InfoStandards", InfoStandards),
    InfoStandardAttach: bookshelf.bookshelf.model("InfoStandardAttach", InfoStandardAttach),
    InfoStandardAttachs: bookshelf.bookshelf.collection("InfoStandardAttachs", InfoStandardAttachs),
    InfoStandardSheet: bookshelf.bookshelf.model("InfoStandardSheet", InfoStandardSheet),
    InfoStandardSheets: bookshelf.bookshelf.collection("InfoStandardSheets", InfoStandardSheets)
}

module.exports = pub;
