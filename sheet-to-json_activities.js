const moment = require("moment");
const fs = require("fs");
const districtWise = require("./state_district_wise");
const districtWiseOld = require("./state_district_wise_old");
const { writeData } = require("./lib");
const { DIR, FILE_ACTIVITIES } = require("./lib/constants");

const normalizeDistrictData = (data) => {
    let result = [];
    Object.keys(data).forEach(state => {
        if (!isUnknown(state)) {
            let districtData = data[state].districtData;
            Object.keys(districtData).forEach((district) => {
                if (!isUnknown(district)) {
                    result.push({
                        id: `${state.toUpperCase()}_${district.toUpperCase()}`,
                        name: `${district}, ${state}`,
                        confirmed: districtData[district].confirmed
                    });
                }
            });
        }
    });
    return result;
};

const districtWiseActivities = () => {
    const districtData = normalizeDistrictData(districtWise);
    const districtDataOld = normalizeDistrictData(districtWiseOld);
    let activities = [];
    districtData.forEach(district => {
        const { id, name, confirmed } = district;
        const districtOld = districtDataOld.find(d => d.id === id);
        const lastUpdatedTime = moment().utcOffset(330).format("lll");
        if (!districtOld) {
            activities.push({
                id, lastUpdatedTime,
                message: `${confirmed} new confirmed ${confirmed > 1 ? 'cases' : 'case'} in ${name}`
            });
        } else {
            const diff = confirmed - districtOld.confirmed;
            if (diff > 0) {
                activities.push({
                    id, lastUpdatedTime,
                    message: `${diff} new confirmed ${diff > 1 ? 'cases' : 'case'} in ${name}`
                });
            }
        }
    });
    return activities;
};

const mergeActivities = (newActivity) => {
    let mergedActivities = {};
    if (fs.existsSync(DIR + FILE_ACTIVITIES)) {
       let activity = require(`.${FILE_ACTIVITIES}`);
       if (activity && Array.isArray(activity.districtWise)) {
           let activities = activity.districtWise;
           if (!moment().utcOffset(330).isSame(moment.unix(activity.timestamp), "day")) {
               // remove previous day activities
               activities = [];
               delete activity.timestamp;
           }
           newActivity.forEach(aNew => {
               const isSameActivity = activities.some(a => a.id === aNew.id && a.message === aNew.message);
               if (!isSameActivity) {
                   activities.unshift(aNew);
               }
           });
           mergedActivities.districtWise = activities;
           mergedActivities.timestamp = activity.timestamp;
       }
    }

    return {
        timestamp: mergedActivities.timestamp || moment().utcOffset(330).unix(),
        districtWise: mergedActivities.districtWise || newActivity
    };
};

const isUnknown = (name) => name.toLowerCase() === "unknown";

async function task() {
    console.log(`Getting activities...`);
    let data = districtWiseActivities();
    console.log(`Merging activities...`);
    let mergedData = mergeActivities(data);
    console.log(`Writing data to json file: ${FILE_ACTIVITIES}...`);
    await writeData({ file: FILE_ACTIVITIES, data: mergedData });
    console.log("Operation completed!");
}

(async function main() {
    console.log("Running task on start...");
    await task();
    console.log("Created Json File With Updated Contents");
})();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly