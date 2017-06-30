"use strict";

const fs = require('fs');

/* constructor */
function JsonUtils(){};

/* instance methods */
JsonUtils.prototype.getJsonSchemaFromFile = function (filePath){
  let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return obj;
};

JsonUtils.prototype.validateJsonDataBySchema = function (data, schema){
  let $RefParser = require('json-schema-ref-parser');

  return new Promise(function(resolve, reject) {
    $RefParser.dereference(__dirname + "/schemas/", schema, {})
    .then(function(fullSchema) {

      var ZSchema = require("z-schema");
      var options = {
        breakOnFirstError: false
        ,assumeAdditional: true
        ,reportPathAsArray: false
        ,assumeAdditional: false
        //,strictMode: false
        //,ignoreUnresolvableReferences: true
        //,forceProperties: true
      };

      var validator = new ZSchema(options);
      if (JsonUtils.validateSchema(validator, fullSchema)){
        var valid = validator.validate(data, fullSchema);
        var errors = validator.getLastErrors(); // this will return an array of validation errors encountered
        var result = {
          "valid": valid,
          "errors": errors
        };
        resolve(result);
      }

    })
    .catch(function(err) {
      console.error(err);
      reject(err);
    });
  });

};

/* static methods */
JsonUtils.validateSchema = function(validator, schema){
  var allSchemasValid = validator.validateSchema(schema);
  if (allSchemasValid===false){
    var errors = validator.getLastErrors();
    console.log(JSON.stringify(errors));
  } /*else {
    console.log("SCHEMA VALID!");
  }*/
  return allSchemasValid;
};

module.exports = JsonUtils;
