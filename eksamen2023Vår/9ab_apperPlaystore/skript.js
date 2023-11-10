const dataJson = require('./googleplaystore.json');

// Lager en 2d array med kategoritypene og anntal apper innenfor katogeriene som egne arrays
function objKeysToObj(obj) {
  let simpleCategoriesArr = [];
  for (let i = 0; i < obj.length; i++) {
    simpleCategoriesArr.push(obj[i].Category)
  }
  simpleCategoriesArr.sort()

  let complexCategoriesArr = []
  let caunt = 1;
  for (let i = 0; i < simpleCategoriesArr.length; i++) {
    if (simpleCategoriesArr[i] === simpleCategoriesArr[i+1]) {
      caunt++;
    } else {
      complexCategoriesArr.push([simpleCategoriesArr[i], caunt])

      // categoriesObj[categoriesArr[i]] = caunt;
      caunt = 1
    }
  }
  return complexCategoriesArr
}
let categoriesCounted = objKeysToObj(dataJson)

// kutter ned 2d arrayen til bare de n største
function findTopNKeysInObj(arr, n) {
  // gjør objekt til 2d array

  // sorter array
  arr.sort(function(a, b) {
    return b[1] - a[1];
  });

  // Fjern alle elementer bortsett fra de n første
  if (arr.length > n) {
    arr = arr.slice(0, n);
  }
  return arr
}
const n = 3
const highestKeys = findTopNKeysInObj(categoriesCounted, n)

// finner gjennomsnittet av alle ratingene fra en valgfri ketagori
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

// finner gjennomsnittet av alle installasjonene fra en valgfri ketagori
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

// finner de n mest populære appene innenfor en kategori
function popularApp(obj, category, n) {
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
    categoryApps[i][1] = parseInt(categoryApps[i][1])
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


//hviser de n mest populære kategoriene
let mostPopularCategories = [];
for (let i = 0; i < n; i++) {
  mostPopularCategories.push({ 'kategori': highestKeys[i][0], 'antall apper': highestKeys[i][1], 'gjennomsnittsrating': Math.round(averageRating(dataJson, highestKeys[i][0]) * 100) / 100, 'gjennomsnittlige antallet installasjoner': Math.round(averageInstalls(dataJson, highestKeys[i][0])) })
}
console.log();
console.log("Mest populære kategorier:");
console.table(mostPopularCategories);

//hviser de n mest populære spillene av de n mest populære kategoriene
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