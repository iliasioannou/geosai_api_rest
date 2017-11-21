"use strict";

const HASH_MAP_SCHEMA_FILEPATH = {
  "Modulo_1" : __dirname+"/../schemas/Modulo_1/Modulo_1_12-05-2016.json",
  "Modulo_1E" : __dirname+"/../schemas/Modulo_1E/Modulo_1E_12-05-2016.json",
  "Modulo_2" : __dirname+"/../schemas/Modulo_2/Modulo_2_17-10-2016.json",
  "Modulo_3" : __dirname+"/../schemas/Modulo_3/Modulo_3_12-05-2016.json",
  "Modulo_4" : __dirname+"/../schemas/Modulo_4/Modulo_4_12-05-2016.json",
  "Modulo_5I" : __dirname+"/../schemas/Modulo_5I/Modulo_5I_12-05-2016.json",
  "Modulo_5T" : __dirname+"/../schemas/Modulo_5T/Modulo_5T_12-05-2016.json",
  "Modulo_6A" : __dirname+"/../schemas/Modulo_6A/Modulo_6A_12-05-2016.json",
  "Modulo_6F" : __dirname+"/../schemas/Modulo_6F/Modulo_6F_12-05-2016.json",
  "Modulo_6U" : __dirname+"/../schemas/Modulo_6U/Modulo_6U_12-05-2016.json"
};

/* constructor */
function Config(){};

/* instance methods */
Config.prototype.getModuleSchemaPath = function (key) {
  return HASH_MAP_SCHEMA_FILEPATH[key];
};


module.exports = Config;
