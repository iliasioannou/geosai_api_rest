/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";

const fs = require('fs');
const path = require('path');
const fileSuffix = '_VALIDATION';
let Utils = require("./Utils");
let Config = require("./config/Config");
let pgp = require('pg-promise')(); //https://www.npmjs.com/package/pg-promise
const logger = require("./log");

let config = new Config();
let cn = null;

const MODULE_NAME = "       [loader].";

/* constructor */
function Loader() {}

/* instance methods */
Loader.prototype.storeMonitoringFileIntoDatabase = function (
  idMonitoringFile, excelFullpath, sheets
) {
  let logMetadata = MODULE_NAME + "storeMonitoringFileIntoDatabase";
  logger.log.debug(logger.utils.dividerDots, logMetadata);

  let fullPath = excelFullpath;
  let fileName = path.basename(fullPath, '.xls');
  let jsonData = Loader.getJsonDataFromFile(
    path.join(path.dirname(fullPath), fileName + '.json')
  );

  return new Promise(function (resolve, reject) {
    Loader.storeDataIntoDatabase(jsonData, idMonitoringFile, sheets)
      .then(function (result) {
        pgp.end();
        resolve(result);
      })
      .catch(function (error) {
        pgp.end();
        console.log("LOADER ERROR: ", error.message || error);
        resolve(false);
      })
      /*.finally(function (error) {
        pgp.end();
      })*/
    ;
  });

};

/* static methods */
Loader.getJsonDataFromFile = function (filePath) {
  let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return obj;
};

Loader.getTableNameFromSheets = function (sheets, excelSheetName) {
  let pgTableName = '';
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i]["excelSheetName"] === excelSheetName) {
      pgTableName = sheets[i]["pgTableName"];
      console.log("pgTableName: ", pgTableName);

      break;
    }
  }
  return pgTableName;
};

Loader.getStationDetails = function (data, sheets) {
  return {
    tablename: Loader.getTableNameFromSheets(sheets.sheetStation, config.EXCEL_SHEET_STATION),
    data: data[config.EXCEL_SHEET_STATION]
  };
};

Loader.databaseConnection = function () {
  let connection = config.DATABASE_CONFIG.connection;
  return pgp(connection);
};

Loader.normalizeColumns = function (columnList) {
  let colList = Utils.clone(columnList);
  var index = colList.indexOf(config.FIELD__TIME.excel);
  if (~index) {
    colList[index] = config.FIELD__TIME.database;
  }
  index = colList.indexOf(config.FIELD__METHOD_CHL_A.excel);
  if (~index) {
    colList[index] = config.FIELD__METHOD_CHL_A.database;
  }
  return colList;
};

Loader.insertQuery = function (t, nResult, table, columns, values) {
  let col = Loader.normalizeColumns(columns).map(pgp.as.name).join();
  let val = ""; //let val = values.map(pgp.as.name).join();
  for (var i = 1; i <= values.length; i++) {
    val += "$" + i + ", ";
  }
  val = val.substring(0, val.length - 2);

  let sql = "INSERT INTO " + config.DATABASE_CONFIG.schema + "." + table + " (" + col + ") VALUES (" + val + ")";
  if (nResult === "one") {
    //sql += " RETURNING currval('"+config.DATABASE_CONFIG.schema+"."+table+config.SEQUENCE_VALUE_SUFFIX+"')";
    sql += " RETURNING *";
  }

  /*
    console.log("sql: ", sql);
    console.log("values: ", values);
    console.log("------");
    */
  return eval("t." + nResult + "(sql, values);");
};

Loader.storeDataIntoDatabase = function (jsonData, idMonitoringFile, sheets) {
  let logMetadata = MODULE_NAME + "storeDataIntoDatabase";
  logger.log.debug(logger.utils.dividerDots, logMetadata);


  let stationDetails = Loader.getStationDetails(jsonData, sheets);

  return new Promise(function (resolve, reject) {
    cn = Loader.databaseConnection();
    cn.tx(function (t1) { // this = t1 = transaction protocol context;
        // this.ctx = transaction config + state context;
        let stationQueries = [];

        for (var s = 0; s < stationDetails.data.length; s++) {
          let stationColumns = [config.FIELD__ID_MONITORING_FILE];
          let stationValues = [idMonitoringFile];
          for (var stationColumn in stationDetails.data[s]) {
            stationColumns.push(stationColumn);
            stationValues.push(stationDetails.data[s][stationColumn]);
          }
          /*
          console.log(stationDetails.tablename);
          console.log(stationColumns);
          console.log(stationValues );
          console.log("------");
          */

          logger.log.debug("station values: %s", stationValues, logMetadata);
          stationQueries.push(
            Loader.insertQuery(
              t1, "one", stationDetails.tablename, stationColumns, stationValues
            )
            .then(function (station) {
              //console.log("STATION SUCCESS: ", JSON.stringify(station));
              logger.log.debug("station <%s> inserted with id: %d", station.NationalStationID, station.idMonitoring, logMetadata);

              let idMonitoring = station.idMonitoring;
              let nationalStationIdValue = station.NationalStationID;
              let sheetQueries = [];

              //Sheet Iteration
              for (var sheet in jsonData) { // sheet == Sheet : data[sheet] == Sheet Item List
                let pgTableName = Loader.getTableNameFromSheets(sheets.sheetsMeasure, sheet);
                if ((pgTableName !== "") && (pgTableName !== config.EXCEL_SHEET_STATION)) {
                  logger.log.debug("Table: %s", pgTableName, logMetadata);

                  //Sheet Items Iteration
                  for (var j = 0; j < jsonData[sheet].length; j++) {
                    if (jsonData[sheet][j][config.FIELD__NATIONAL_STATION_ID] === nationalStationIdValue) {
                      let columns = [config.FIELD__ID_MONITORING];
                      let values = [idMonitoring];
                      for (var column in jsonData[sheet][j]) {
                        columns.push(column);
                        values.push(jsonData[sheet][j][column]);
                      }
                      //console.log(pgTableName + "." + columns + " = " +  values );
                      sheetQueries.push(
                        Loader.insertQuery(t1, "one", pgTableName, columns, values)
                        .then(function (res) {
                          //console.log("SHEET SUCCESS!", JSON.stringify(res));
                          logger.log.debug("Station %s: measure <%s> inserted with id: %s", nationalStationIdValue, pgTableName, res.id, logMetadata);
                        })
                        .catch(function (err) {
                          logger.log.error("Problem during insert into table: %s", pgTableName, logMetadata);
                          logger.log.error("columns: %s", columns, logMetadata);
                          logger.log.error("values: %s", values, logMetadata);
                          logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
                          logger.log.error(err.stack, logMetadata);
                          resolve(false);
                          return;
                        })
                      );
                    }
                  }
                }
              }
              return t1.batch(sheetQueries);


            })
            .catch(function (err) {
              logger.log.error("Problem during insert into station table: %s", stationDetails.tablename, logMetadata);
              logger.log.error("columns: %s", stationColumns, logMetadata);
              logger.log.error("values: %s", stationValues, logMetadata);
              logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
              logger.log.error(err.stack, logMetadata);

              resolve(false);
              return;
            })
          );
        }
        return t1.batch(stationQueries);
      })
      .then(function (data) {
        //console.log("TRANSACTION SUCCESS!" /*+JSON.stringify(data)*/ );
        logger.log.debug("TRANSACTION SUCCESS!", logMetadata);
        resolve(true);
      })
      .catch(function (error) {
        //console.log("TRANSACTION ERROR: ", error.message || error);
        logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
        logger.log.error(err.stack, logMetadata);

        resolve(false);
      });
  });
};

module.exports = Loader;