"use strict";

const excelToJson = require('convert-excel-to-json');

/* constructor */
function ExcelUtils(){};

/* instance methods */
ExcelUtils.prototype.getJsonFromExcel = function (excelFilePath) {
  const jsonResult = excelToJson({
    sourceFile: excelFilePath // src excel file
    ,header:{rows: 1}         // from which row to start
    //,range: 'A2:B3'         // top-left bottom-right range
    ,columnToKey: {           // KVP mapping to excel first row (header)
      '*': '{{columnHeader}}'
    }
    /*,sheets: [{             // sheets
      name: 'Stazioni'        // sheet name
      //,range: 'A2:B3',      // custom range per sheet
      ,columnToKey: {
        //A: '{{A1}}'
        //,B: '{{B1}}'
        //,C: '{{C1}}'
        '*': '{{columnHeader}}' // KVP mapping to excel first row (header)
      }
    }]*/
  });
  return jsonResult;
};

module.exports = ExcelUtils;
