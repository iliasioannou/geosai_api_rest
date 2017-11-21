"use strict";
let dbConfig = require("../../../config/dbConfig.js");

const DATABASE_CONFIG = {
  client: "postgres",
  connection: {
    host: dbConfig.connection.host,
    port: 5432,
    database: dbConfig.connection.database,
    user: dbConfig.connection.user,
    password: dbConfig.connection.password,
  },
  schema: "public"
};

// Passed by API to Loader
const FIELD__ID_MONITORING_FILE = "idMonitoringFile";
// Nextval sequence within "Stazioni" sheet
const FIELD__ID_MONITORING = "idMonitoring";
// Unique ID within "Stazioni" sheet and reported one-or-many within measure sheets
const FIELD__NATIONAL_STATION_ID = "NationalStationID";

// File: pkz019_SIC_DB\design-db\analisi_all_standardinformativi.xlsx
// Sheet: foglio "nomecampi_excel2pg"
// Differences excel columns and database filed names
const FIELD__TIME = {
  excel: "Time",
  database: "Time_"
};
const FIELD__METHOD_CHL_A = {
  excel: "Method_Chl-a",
  database: "Method_Chl_a"
};

// Excel Sheet "Stazioni"
const EXCEL_SHEET_STATION = "Stazioni";
// Sequence Value Suffix: tablename+suffix. Ex.: 'is1_stazioni_idmonitoring_seq'
const SEQUENCE_VALUE_SUFFIX = "_idmonitoring_seq";

/* constructor */
function Config() {};

/* instance constants */
Config.prototype.DATABASE_CONFIG = DATABASE_CONFIG;
Config.prototype.FIELD__ID_MONITORING_FILE = FIELD__ID_MONITORING_FILE;
Config.prototype.FIELD__ID_MONITORING = FIELD__ID_MONITORING;
Config.prototype.FIELD__NATIONAL_STATION_ID = FIELD__NATIONAL_STATION_ID;
Config.prototype.EXCEL_SHEET_STATION = EXCEL_SHEET_STATION;
Config.prototype.SEQUENCE_VALUE_SUFFIX = SEQUENCE_VALUE_SUFFIX;
Config.prototype.FIELD__TIME = FIELD__TIME;
Config.prototype.FIELD__METHOD_CHL_A = FIELD__METHOD_CHL_A;

module.exports = Config;