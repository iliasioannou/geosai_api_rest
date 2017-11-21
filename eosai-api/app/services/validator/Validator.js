"use strict";

const fs = require('fs');
const path = require('path');
const json2xls = require('json2xls');
//const Excel = require('exceljs'); //https://www.npmjs.com/package/exceljs
const fileSuffix = '_VALIDATION';

let ExcelUtils = require("./ExcelUtils");
let JsonUtils = require("./JsonUtils");
let Utils = require("./Utils");
let Config = require("./config/Config");
let TransformValidatorResult = require("./TransformValidatorResult");

/* default options */
let defaultOptions = {
  writeJsonDataToFile: false,
  writeJsonValidationToFile: false
};

let excelFullPath = '';
let excelFileName = '';
let excelFileCode = '';
let self = this;

/* constructor */
function Validator(options) {
  // options
  if (typeof options === "object") {
      var keys = Object.keys(options),
          idx = keys.length,
          key;
      // check that the options are correctly configured
      while (idx--) {
          key = keys[idx];
          if (defaultOptions[key] === undefined) {
              throw new Error("Unexpected option passed to constructor: " + key);
          }
      }
      // copy the default options into passed options
      keys = Object.keys(defaultOptions);
      idx = keys.length;
      while (idx--) {
          key = keys[idx];
          if (options[key] === undefined) {
              options[key] = Utils.clone(defaultOptions[key]);
          }
      }
      this.options = options;
  } else {
      this.options = Utils.clone(defaultOptions);
  }
  self = this;
}

/* instance methods */
Validator.prototype.validateMonitoringFileByModule = function (excelFilePath, moduleName, code) {
  excelFullPath = excelFilePath;
  excelFileName = path.basename(excelFullPath, '.xls');
  excelFileCode = code;

  let jsonData = Validator.getJsonDataFromExcel();
  return new Promise(function(resolve, reject) {
    if (Validator.isNotEmpty(jsonData)===true){
      console.log("VALIDATOR: EXCEL SHEETS ARE NOT  EMPTY!");

      let jsonSchema = Validator.getJsonSchemaFromModule(moduleName);
      Validator.validateJsonDataBySchema(jsonData, jsonSchema)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (error) {
          console.log("VALIDATOR ERROR: ", error.message || error);
          reject(error);
        });
    } else {
      console.log("VALIDATOR ERROR: EXCEL SHEETS ARE EMPTY!");
      reject("VALIDATOR ERROR: EXCEL SHEETS ARE EMPTY!");
    }
  });

};

/* static methods */
Validator.getJsonDataFromExcel = function(){
  let excelUtils = new ExcelUtils();
  let jsonData = excelUtils.getJsonFromExcel(excelFullPath);
  if (self.options.writeJsonDataToFile===true){
    Validator.writeToFile(jsonData,excelFileName+'.json');
  }
  return jsonData;
};

Validator.isNotEmpty = function(jsonData){
  let valid = false;
  if (JSON.stringify(jsonData)!==""){
    for(var sheet in jsonData) {
      if (jsonData[sheet].length>0){
        valid = true;
        break;
      }
    }
  }
  return valid;
};

Validator.getJsonSchemaFromModule = function (moduleName){
  let config = new Config();
  let schemaFile = config.getModuleSchemaPath(moduleName);
  let jsonUtils = new JsonUtils();
  return jsonUtils.getJsonSchemaFromFile(schemaFile);
};

Validator.validateJsonDataBySchema = function (data, schema){

  let jsonUtils = new JsonUtils();

  return new Promise(function(resolve, reject) {
    jsonUtils.validateJsonDataBySchema(data, schema)
    .then(function(result) {
      if (result && (result.valid===false) && (self.options.writeJsonValidationToFile===true)) {
        Validator.writeToFile(result,excelFileName+fileSuffix+'.json')
        .then(function(result) {
          //resolve(result);
        }).catch(function(err) {
          reject(err);
        });

        if ((typeof(result.errors)==="object") &&
            (result.errors.length) && (result.errors.length>0)){
          Validator.getExcelFromJson(result,excelFileName+fileSuffix+'.xls')
          .then(function(result) {
            //resolve(result);
          }).catch(function(err) {
            reject(err);
          });
          Validator.getExcelFromJson(result,excelFileCode+fileSuffix+'.xls')
          .then(function(result) {
            //resolve(result);
          }).catch(function(err) {
            reject(err);
          });           
        }
      }
      resolve(result);

    }).catch(function(err) {
      reject(err);
    });
  });

};

Validator.writeToFile = function(data,filename){
  return new Promise(function(resolve, reject) {
    fs.writeFile(
      path.join(path.dirname(excelFullPath),filename)
      ,JSON.stringify(data)
      ,function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });

};

Validator.getExcelFromJson = function (data,filename){

  let transformValidatorResult = new TransformValidatorResult();
  let transformedValidationErrors = transformValidatorResult.transform(data);
  const optionsXls = {
    fields: {
      foglio: "string",
      riga: "number",
      colonna: "string",
      codice: "string",
      messaggio: "string"
    }
  };
  let xls = json2xls(transformedValidationErrors, optionsXls);

  return new Promise(function(resolve, reject) {
    fs.writeFile(
      path.join(path.dirname(excelFullPath),filename)
      ,xls
      ,"binary"
      ,function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });

/*return new Promise(function(resolve, reject) {
    let workbook = new Excel.Workbook();
    // create new sheet with pageSetup settings for A4 - landscape
    var worksheet =  workbook.addWorksheet('sheet', {
      pageSetup:{paperSize: 9, orientation:'landscape'}
    });
    // Add column headers and define column keys and widths
    // Note: these column structures are a workbook-building convenience only,
    // apart from the column width, they will not be fully persisted.
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
    ];
    worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
    workbook.xlsx.writeFile(
      path.join(path.dirname(excelFullPath),filename)
    )
    .then(function() {
        resolve(true);
    });
  });*/

};
module.exports = Validator;
