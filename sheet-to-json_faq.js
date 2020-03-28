const { task } = require("./lib");
const { SHEET, SHEET_FAQ, FILE_FAQ } = require("./lib/constants");

const tabs = {
  faq: SHEET_FAQ,
};

(async function main() {
  console.log("Running task on start...");
  await task({ sheet: SHEET, tabs, file: FILE_FAQ});
  console.log("Created Json File With Updated Contents");
}) ();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly
