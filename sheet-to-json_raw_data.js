const { task } = require("./lib");
const { SHEET, SHEET_RAW_DATA, FILE_RAW_DATA } = require("./lib/constants");

const tabs = {
  raw_data: SHEET_RAW_DATA,
};

(async function main() {
  console.log("Running task on start...");
  await task({ sheet: SHEET, tabs, file: FILE_RAW_DATA});
  console.log("Created Json File With Updated Contents");
}) ();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly
