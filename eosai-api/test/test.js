/*jshint esversion: 6*/
/*jshint node: true*/

"use strict";


const fs = require("fs");
const json2xls = require('json2xls');
const assert = require("assert");
const logger = require("../app/utils/log");
const trasf = require("../app/utils/trasformValidatorResult");

const MODULE_NAME = "       [test.trasf].";

const JSON_FILE_NAME = "/opt/pkz019_SIC_Repository/monitoringfiles/1_VALIDATION.json";
const jsonToTrasform = JSON.parse(fs.readFileSync(JSON_FILE_NAME, "utf8"));



describe("trasf", function () {

	before(function () {
		logger.log.debug("Test is starting ...");
	});

	after(function () {
		logger.log.debug("Test is finished!");
	});

	describe('#transform()', function () {
		let logMetadata = MODULE_NAME + "transform";

		it('#transform', function (done) {

			let result = trasf.transform(jsonToTrasform);
			//logger.log.debug("Json transform: %s", JSON.stringify(result), logMetadata);

			const optionsXls = {
				fields: {
					foglio: "string",
					riga: "number",
					colonna: "string",
					messaggio: "string"
				}
			};
			let xls = json2xls(result, optionsXls);

			fs.writeFileSync("/opt/pkz019_SIC_Repository/monitoringfiles/1_VALIDATION.xlsx", xls, "binary");


			done();

		});
	});

});