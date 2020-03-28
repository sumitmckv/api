const { task } = require("./lib");
const { SHEET, SHEET_NAME_FACTOIDS, FILE_WEBSITE_DATA } = require("./lib/constants");

const tabs = {
  factoids: SHEET_NAME_FACTOIDS,
};

(async function main() {
  console.log("Running task on start...");
  await task({ sheet: SHEET, tabs, file: FILE_WEBSITE_DATA});
  console.log("Created Json File With Updated Contents");
}) ();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly
