const dataJson = require('./googleplaystore.json');


function objKeysToObj(obj) {
  let categories = [];
  for (let i = 0; i < obj.length; i++) {
    categories.push(obj[i].Category)
  }
  categories.sort()

  let categoriesNumbered = {}
  let caunt = 1;
  for (let i = 0; i < categories.length; i++) {
    if (categories[i] === categories[i+1]) {
      caunt++;
    } else {
      categoriesNumbered[categories[i]] = caunt;
      caunt = 1
    }
  }
  return categoriesNumbered
}
let categoriesNumbered = objKeysToObj(dataJson)


function findTopNKeysInObj(obj, n) {
  // gjør objekt til 2d array
  let entries = Object.entries(obj);

  // sorter array
  entries.sort(function(a, b) {
    return b[1] - a[1];
  });

  // Fjern alle elementer bortsett fra de n første
  if (entries.length > n) {
    entries = entries.slice(0, n);
  }
  return entries
}
const n = 3
const highestKeys = findTopNKeysInObj(categoriesNumbered, n)


function averageRating(obj, category) {
  let ratings = [];
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].Category === category && obj[i].Rating !== 'NaN') {
      ratings.push(obj[i].Rating)
    }
  }
  //gjennomsnitt
  let sum = 0.0;
  for(let i = 0; i < ratings.length; i++) {
    sum += parseFloat(ratings[i]);
  }
  return sum / ratings.length;
}


function averageInstalls(obj, category) {
  let installs = [];
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].Category === category && obj[i].Installs !== 'NaN') {
      installs.push(obj[i].Installs)
    }
  }

  for (let i = 0; i < installs.length; i++) {
    installs[i] = installs[i].replaceAll(",", "")
    installs[i] = installs[i].replaceAll("+", "")
  }
  //gjennomsnitt
  let sum = 0.0;
  for(let i = 0; i < installs.length; i++) {
    sum += parseInt(installs[i]);
  }
  
  return sum / installs.length;
}


function popularApp(obj, category) {
  let categoryApps = {};
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].Category === category) {
      categoryApps[obj[i].App] = obj[i].Installs;
    }
  }

  categoryApps = Object.entries(categoryApps);

  for (let i = 0; i < categoryApps.length; i++) {
    categoryApps[i][1] = categoryApps[i][1].replaceAll(",", "")
    categoryApps[i][1] = categoryApps[i][1].replaceAll("+", "")
  }

  // sorter array
  categoryApps.sort(function(a, b) {
    return b[1] - a[1];
  });

  // Fjern alle elementer bortsett fra de n første
  if (categoryApps.length > n) {
    categoryApps = categoryApps.slice(0, n);
  }
  return categoryApps
}


let mostPopularCategories = [];
for (let i = 0; i < n; i++) {
  mostPopularCategories.push({ 'kategori': highestKeys[i][0], 'antall apper': highestKeys[i][1], 'gjennomsnittsrating': Math.round(averageRating(dataJson, highestKeys[i][0]) * 100) / 100, 'gjennomsnittlige antallet installasjoner': Math.round(averageInstalls(dataJson, highestKeys[i][0])) })
}
console.log();
console.log("Mest populære kategorier:");
console.table(mostPopularCategories);

let popularFAMILY = popularApp(dataJson, 'FAMILY')
let popularGAME = popularApp(dataJson, 'GAME')
let popularTOOLS = popularApp(dataJson, 'TOOLS')
let mostPopularApps = [];
for (let i = 0; i < n; i++) {
  let category
  switch (i) {
    case 0: category = popularFAMILY; break;
    case 1: category = popularGAME; break;
    case 2: category = popularTOOLS; break;
  }
  for (let j = 0; j < n; j++) {
    mostPopularApps.push({ 'kategori': highestKeys[i][0], 'app': category[j][0], 'installasjoner': category[j][1] })
  }
}
console.log();
console.log("Mest populære apper i kategoriene:");
console.table(mostPopularApps);