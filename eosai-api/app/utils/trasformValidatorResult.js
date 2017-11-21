/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";

const fs = require('fs');
const path = require("path");
const DataTransform = require("node-json-transform").DataTransform;
const logger = require("./log");

const MODULE_NAME = "       [utils.convertValidatorResult].";


var map = {
    list: 'errors',
    item: {
        foglio: "path",
        riga: "path",
        colonna: "path",
        messaggio: "description",
    },
    operate: [{
        run: function (val) {
            return val.split(path.sep)[1];
        },
        on: "foglio"
    },
    {
        run: function (val) {
            return parseInt(val.split(path.sep)[2]) + 2;
        },
        on: "riga"
    },
    {
        run: function (val) {
            return val.split(path.sep)[3];
        },
        on: "colonna"
    }],
    each: function (item) {
        return item;
    }
};



const transform = function (dataToTrasform) {
    let logMetadata = MODULE_NAME + "transform";

    const dataTransform = DataTransform(dataToTrasform, map);
    const resultToReturn = dataTransform.transform();
    //logger.log.debug("Json transform: %s", JSON.stringify(resultToReturn), logMetadata);
    return resultToReturn;
};

// Public
var pub = {
    transform: transform
};


module.exports = pub;