
const fs = require('fs');
const drive = require("drive-db");
let moment = require("moment");
const rawData = require('./raw_data');

const SHEET = "1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk";
const SHEET_STATEWISE_TAB = "ovd0hzm"
const SHEET_CASES_TIME_SERIES_TAB = "o6emnqt"
const SHEET_KEY_VALUES_TAB = "owlnkho"
const SHEET_Tested_Numbers_ICMR_Data = "ozg9iqq"

const dir='./'
const filename = '/data.json'

const tabs = {
  statewise: SHEET_STATEWISE_TAB,
  cases_time_series: SHEET_CASES_TIME_SERIES_TAB,
  key_values: SHEET_KEY_VALUES_TAB,
  tested:SHEET_Tested_Numbers_ICMR_Data,
};

async function fetchData() {
  const data = await Promise.all(
    Object.keys(tabs).map(async tab => {
      return {
        [tab]: await drive({ sheet: SHEET, tab: tabs[tab] })
      };
    })
    );

  let mergedData = {};

  data.forEach(obj => {
    mergedData = { ...mergedData, ...obj };
  });

  mergedData.statewise = mergedData.statewise.map(data => Object.assign(data, {delta: getDelta(data.state)}));
  return mergedData;
}

function sortObjByKey(value) {
  return (typeof value === 'object') ?
    (Array.isArray(value) ?
      value.map(sortObjByKey) :
      Object.keys(value).sort().reduce(
        (o, key) => {
          const v = value[key];
          o[key] = sortObjByKey(v);
          return o;
        }, {})
    ) :
    value;
}

function getDelta(state) {
  return  rawData.raw_data.reduce((stat, row) => {
    let stateName = row.detectedstate;
    let isToday = moment().utcOffset(330).isSame(moment(row.dateannounced, "DD-MM-YYYY"), "day");
    if (stateName && (stateName === state || state === "Total") && isToday) {
      let currentStatus = row.currentstatus;
      if (currentStatus) {
        stat.confirmed += 1;
        switch (currentStatus) {
          case "Hospitalized":
            stat.active += 1;
            break;
          case "Recovered":
            stat.recovered += 1;
            break;
          case "Deceased":
            stat.deaths += 1;
            break;
        }
      } else {
        console.error("Current status is empty in sheet for patient:", row.patientnumber);
      }
    }
    return stat;
  }, {active: 0, confirmed: 0, deaths: 0, recovered: 0});
}

async function writeData(data) {
  const fileContent = JSON.stringify(sortObjByKey(data),null,"\t");
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  return await fs.writeFileSync(dir+filename, fileContent);
}

async function task() {
  console.log("Fetching data from sheets...");
  const data = await fetchData();
  console.log("Writing data to json file...");
  await writeData(data);
  console.log("Opertion completed!");
}


async function main() {
  console.log("Running task on start...");
  await task();
  console.log("Created Json File With Updated Contents");

}

main();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly
