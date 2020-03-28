const { task } = require("./lib");
const { SHEET, SHEET_TRAVEL_HISTORY, FILE_TRAVEL_HISTORY } = require("./lib/constants");

const tabs = {
  travel_history: SHEET_TRAVEL_HISTORY,
};

(async function main() {
  console.log("Running task on start...");
  await task({ sheet: SHEET, tabs, file: FILE_TRAVEL_HISTORY});
  console.log("Created Json File With Updated Contents");
}) ();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly
