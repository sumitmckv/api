const { task } = require("./lib");
const { SHEET, SHEET_DATE_WISE_DELTA, FILE_DATE_WISE_DELTA } = require("./lib/constants");

const tabs = {
  states_daily: SHEET_DATE_WISE_DELTA,
};

(async function main() {
  console.log("Running task on start...");
  await task({ sheet: SHEET, tabs, file: FILE_DATE_WISE_DELTA});
  console.log("Created Json File With Updated Contents");
}) ();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly
