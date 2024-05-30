// jeg bruker node.js for å kjøre skriptet mitt. jeg har derfor tatt meg friheten til å bruke en av node's innebygde moduler 'require' for å hente json objektet

// Importing the JSON object using Node.js 'require' module
const dataJson = require('./05994_20240126-145813-json.json');

/**
 * Function to filter activities by category
 * @param {*} obj object containing activity data
 * @param {*} category Category to filter activities by
 * @returns An array of activity objects filtered by the specified category
 */
function filterActivitiesByCategory(obj, category) {
  const newActivityArr = [];
  let found = false;

  for (let i = 0; i < obj.length; i++) {
    if (obj[i]['alle aktiviteter'] === category) {
      found = true;
      const newObject = {
        'alle aktiviteter': obj[i]['alle aktiviteter'],
        'kjønn': obj[i]['kjønn'],
        'Tidsbruk 2000 I alt': obj[i]['Tidsbruk 2000 I alt']
      };
      newActivityArr.push(newObject);
    } else if (found && obj[i]['alle aktiviteter'].startsWith('�')) { // The sub activity starts with this specific character, it is meant to be an indent
      const newObject = {
        'alle aktiviteter': obj[i]['alle aktiviteter'],
        'kjønn': obj[i]['kjønn'],
        'Tidsbruk 2000 I alt': obj[i]['Tidsbruk 2000 I alt']
      };
      newActivityArr.push(newObject);
    } else if (found && !obj[i]['alle aktiviteter'].startsWith('�')) {
      break; // Break the loop if a different category is encountered after looping through all the sub activities
    }
  }
  return newActivityArr;
}

/**
 * Function to filter out sub activities
 * @param {*} obj Object containing activity data
 * @returns An array of the main categories (not including sub-activities)
 */
function filterOutSubActivities(obj) {
  const newCategoryArr = [];
  for (let i = 0; i < obj.length; i++) {
    if (!obj[i]['alle aktiviteter'].startsWith("�")) {
      const newObject = {
        'alle aktiviteter': obj[i]['alle aktiviteter'],
        'kjønn': obj[i]['kjønn'],
        'Tidsbruk 2000 I alt': obj[i]['Tidsbruk 2000 I alt']
      };
      newCategoryArr.push(newObject);
    }
  }
  return newCategoryArr;
}

/**
 * Function to find the fastest gender for each activity
 * @param {*} arr Array of activity objects
 * @returns An object containing the fastest gender and time for each activity
 */
function findActivitiesWithLowerTimeByGender(arr) {
  let bestTime = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]['kjønn'] !== 'Alle') { // Ignoring the gender 'Alle' as its not relevant
      const separated = separateFloat(arr[i]['Tidsbruk 2000 I alt']);
      if (!bestTime[arr[i]['alle aktiviteter']]) {// Check if the activity is already in the bestTime object
        const newObject = {
          'Raskeste kjønn': arr[i]['kjønn'],
          'tid (time.min)': arr[i]['Tidsbruk 2000 I alt'],
        };
        bestTime[arr[i]['alle aktiviteter']] = newObject;
      } else if (bestTime[arr[i]['alle aktiviteter']]['tid (time.min)'] > arr[i]['Tidsbruk 2000 I alt']) { // If the new time is faster, update the object with the new time
        const newObject = {
          'Raskeste kjønn': arr[i]['kjønn'],
          'tid (time.min)': arr[i]['Tidsbruk 2000 I alt'],
          'tid spart (time.min)': differanceInTime(bestTime[arr[i]['alle aktiviteter']]['tid (time.min)'], arr[i]['Tidsbruk 2000 I alt'])
        };
        bestTime[arr[i]['alle aktiviteter']] = newObject;
      } else if (bestTime[arr[i]['alle aktiviteter']]['tid (time.min)'] === arr[i]['Tidsbruk 2000 I alt']) {// If the time is the same, mark it as equally fast for both genders
        bestTime[arr[i]['alle aktiviteter']]['Raskeste kjønn'] = 'Like raske';
        bestTime[arr[i]['alle aktiviteter']]['tid spart (time.min)'] = 0;
      } else {
        bestTime[arr[i]['alle aktiviteter']]['tid spart (time.min)'] = differanceInTime(arr[i]['Tidsbruk 2000 I alt'], bestTime[arr[i]['alle aktiviteter']]['tid (time.min)']);
      }
    }
  }
  return bestTime;
}

/**
 * Function to find the activity with the maximum time saved. This function can be genger spesific or general
 * @param {*} object Object containing activities and their corresponding time saved
 * @returns Object representing the activity with the maximum time saved
 */
function findMaxTimeSavedByGender(object, gender = null) {
  let maxTimeSaved = -Infinity;
  let maxTimeSavedObject = null;

  for (let key in object) {
    if (object.hasOwnProperty(key) && (gender === null || object[key]['Raskeste kjønn'] === gender)) {
      if (object[key]['tid spart (time.min)'] > maxTimeSaved) {
        maxTimeSaved = object[key]['tid spart (time.min)'];
        maxTimeSavedObject = object[key];
      }
    }
  }

  return maxTimeSavedObject;
}

/**
 * Function to calculate the difference in time between two floats. Note that the larger float needs to be float1, but the function is only called when that is allready established
 * @param {*} float1 The first and bigger float number
 * @param {*} float2 The second and smaller float number
 * @returns The difference in time between float1 and float2
 */
function differanceInTime(float1, float2) {
  const float1Separated = separateFloat(float1);
  const float2Separated = separateFloat(float2);
  let hour = float1Separated.left - float2Separated.left
  let min = float1Separated.right - float2Separated.right
  if (min >= 60) {
    min -= 60
    hour++
  } else if (min < 0) {
    min += 60
    hour--
  }
  return parseFloat(hour.toString() + '.' + min.toString())
}

/**
 * Function to separate a float number into its integer and decimal parts
 * @param {*} floatNum Float number to separate
 * @returns An object containing the integer and decimal parts of the float number
 */
function separateFloat(floatNum) {
  const floatStr = floatNum.toString();
  const parts = floatStr.split('.');
  const leftPart = parseInt(parts[0], 10);
  let rightPart = parts.length > 1 ? parts[1] : '0';
  rightPart = rightPart.padEnd(2, '0').substring(0, 2); // Ensure rightPart has two digits

  return {
    left: leftPart,
    right: rightPart
  };
}

/**
 * Function to remove � prefix, its meant as an indent to show sub activities
 * @param {*} str Input string
 * @returns The input string with the prefix characters removed
 */
function removeIndentPrefix(str) {
  if (str.startsWith("� ")) {
    return str.substring(2);
  }
  return str;
}

/**
 * Function to display an object as a table
 * @param {*} obj Object to display as a table
 */
function displayObjAsTable(obj) {
  let tableArr = [];
  for (let key in obj) {
    let newObj = { // Create a new object with new formatting better for display
      'Aktivitet': removeIndentPrefix(key),
      ...obj[key] // Copy other key-value pairs from the input object
    };

    // Separate the time 'tid (time.min)' into hours and minutes
    const timeSeparatedFloat = separateFloat(newObj['tid (time.min)']);
    newObj['tid (time)'] = timeSeparatedFloat.left;
    newObj['tid (min)'] = timeSeparatedFloat.right;
    delete newObj['tid (time.min)'];
    
    // Separate the time 'tid spart (time.min)' into hours and minutes
    const savedTimeSeparatedFloat = separateFloat(newObj['tid spart (time.min)']);
    newObj['tid spart (time)'] = savedTimeSeparatedFloat.left;
    newObj['tid spart (min)'] = savedTimeSeparatedFloat.right;
    delete newObj['tid spart (time.min)'];

    tableArr.push(newObj);
  }  
  console.table(tableArr);
}

// console.log(findActivitiesWithLowerTimeByGender(filterActivitiesByCategory(dataJson, 'Husholdsarbeid i alt')));
// displayObjAsTable(findActivitiesWithLowerTimeByGender(filterActivitiesByCategory(dataJson, 'Husholdsarbeid i alt')));
// displayObjAsTable(findActivitiesWithLowerTimeByGender(filterActivitiesByCategory(dataJson, 'Fritid i alt')));
// displayObjAsTable(findActivitiesWithLowerTimeByGender(filterOutSubActivities(dataJson)));
// console.log(findMaxTimeSaved(findActivitiesWithLowerTimeByGender(filterOutSubActivities(dataJson))));
console.log(findMaxTimeSavedByGender(findActivitiesWithLowerTimeByGender(filterActivitiesByCategory(dataJson, 'Fritid i alt'))));
