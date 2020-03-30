const districtWise = require("./state_district_wise");
const districtWiseOld = require("./state_district_wise_old");
const { writeData } = require("./lib");
const { FILE_ACTIVITIES } = require("./lib/constants");

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
        const districtOld = districtDataOld.find(d => d.id === district.id);
        if (!districtOld) {
            activities.push({
                id: district.id,
                message: `${district.confirmed} new confirmed ${district.confirmed > 1 ? 'cases' : 'case'} in ${district.name}`
            });
        } else {
            const diff = district.confirmed - districtOld.confirmed;
            if (diff > 0) {
                activities.push({
                    id: district.id,
                    message: `${diff} new confirmed ${diff > 1 ? 'cases' : 'case'} in ${district.name}`
                });
            }
        }
    });
    return activities;
};

const isUnknown = (name) => name.toLowerCase() === "unknown";

async function task() {
    console.log(`Getting activities...`);
    let data = districtWiseActivities();
    console.log(`Writing data to json file: ${FILE_ACTIVITIES}...`);
    await writeData({file: FILE_ACTIVITIES, data: { districtWise: data }});
    console.log("Operation completed!");
}

(async function main() {
    console.log("Running task on start...");
    await task();
    console.log("Created Json File With Updated Contents");
})();

// source https://github.com/reustle/covid19japan/blob/master/scripts/cache-spreadsheet-data/cache-sheet.js , and made the changes accordingly