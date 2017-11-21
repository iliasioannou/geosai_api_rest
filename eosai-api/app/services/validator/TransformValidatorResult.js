"use strict";

const path = require("path");
const DataTransform = require("node-json-transform").DataTransform;

let map = {
    list: 'errors',
    item: {
        foglio: "path",
        riga: "path",
        colonna: ["path", "params"],
        codice: "code",
        messaggio: ["description","message"]
    },
    operate: [{
        run: function (val) {
            return val.split(path.sep)[1];
        },
        on: "foglio"
    },
    {
        run: function (val) {
            return parseInt(val.split(path.sep)[2]) + 2;//2: header + array start point from 0
        },
        on: "riga"
    },
    {
        run: function (val) {
            return (val[0].split(path.sep)[3]
            ? val[0].split(path.sep)[3]
            : val[1]);
        },
        on: "colonna"
    },
    {
        run: function (val) {
            return (val[0] ? val[0] : val[1]);
        },
        on: "messaggio"
    }],
    each: function (item) {
        item.iterated = true;
        return item;
    }
};

/* constructor */
function TransformValidatorResult(){};

/* instance methods */
TransformValidatorResult.prototype.transform = function (dataToTrasform) {
  const dataTransform = DataTransform(dataToTrasform, map);
  const resultToReturn = dataTransform.transform();
  return resultToReturn;
};

module.exports = TransformValidatorResult;
