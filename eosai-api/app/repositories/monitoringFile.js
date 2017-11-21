"use strict";
let bookshelf = require("./base");
require("./users");
require("./entities");

// ------------ Monitoring File Status -------------

let MonitoringFileStatus = bookshelf.bookshelf.Model.extend({
    tableName: "fileStatus",
    //hidden: ["idInfStandardName"],
    idAttribute: "idFileStatus"
})

let MonitoringFileStatuss = bookshelf.bookshelf.Collection.extend({
    model: MonitoringFileStatus
});


// ------------ Monitoring File -------------

let MonitoringFile = bookshelf.bookshelf.Model.extend({
    tableName: "monitoringFiles",
    //hidden: ["idMonitoringFile"],
    idAttribute: "idMonitoringFile",
    user: function() {
        return this.belongsTo("User", "idUser");
    },
    status: function() {
        return this.belongsTo("MonitoringFileStatus", "idFileStatus");
    },
    region: function() {
        return this.belongsTo("Region", "idRegion");
    },
    arpa: function() {
        return this.belongsTo("Arpa", "idArpa");
    },
    cnr: function() {
        return this.belongsTo("Cnr", "idCnr");
    },
    amp: function() {
        return this.belongsTo("Amp", "idAmp");
    },
    infoStandard: function() {
        return this.belongsTo("InfoStandard", "idInformativeStandard");
    },
    attachs: function() {
        return this.hasMany("MonitoringFileAttach", "idMonitoringFile");
    }
})

let MonitoringFiles = bookshelf.bookshelf.Collection.extend({
    model: MonitoringFile
});

// ------------ Monitoring File Attach -------------

let MonitoringFileAttach = bookshelf.bookshelf.Model.extend({
    tableName: "mfAttachments",
    //hidden: ["idMonitoringFile"],
    idAttribute: "idMfAttachment",
    hasTimestamps: false,
    //hasTimestamps: ["creationDate", "creationDate"],

    monitoringFile: function() {
        return this.belongsTo("InfoStandard", "idInformativeStandard");
    }
});


let MonitoringFileAttachs = bookshelf.bookshelf.Collection.extend({
    model: MonitoringFileAttach
});



// Public
let pub = {
    MonitoringFileStatus: bookshelf.bookshelf.model("MonitoringFileStatus", MonitoringFileStatus),
    MonitoringFileStatuss: bookshelf.bookshelf.collection("MonitoringFileStatuss", MonitoringFileStatuss),
    MonitoringFile: bookshelf.bookshelf.model("MonitoringFile", MonitoringFile),
    MonitoringFiles: bookshelf.bookshelf.collection("MonitoringFiles", MonitoringFiles),
    MonitoringFileAttach: bookshelf.bookshelf.model("MonitoringFileAttach", MonitoringFileAttach),
    MonitoringFileAttachs: bookshelf.bookshelf.collection("MonitoringFileAttachs", MonitoringFileAttachs)

}

module.exports = pub;
