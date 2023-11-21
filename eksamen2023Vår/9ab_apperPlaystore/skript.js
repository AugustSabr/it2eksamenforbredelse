// jeg bruker node.js for å kjøre skriptet mitt. jeg har derfor tatt meg friheten til å bruke en av node's innebygde moduler 'require' for å hente json objektet
const dataJson = require('./Global YouTube Statistics.json');

// Lager en 2d array med kategoritypene og anntal apper innenfor katogeriene som egne arrays
function objKeysToObj(obj) {
  let simpleCategoriesArr = [];
  for (let i = 0; i < obj.length; i++) {
    simpleCategoriesArr.push(obj[i].category)
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
function averageSubscribers(obj, category) {
  let subscribers = [];
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].category === category) {
      subscribers.push(obj[i].subscribers)
    }
  }
  //gjennomsnitt
  let sum = 0.0;
  for(let i = 0; i < subscribers.length; i++) {
    sum += subscribers[i];
  }
  return sum / subscribers.length;
}
// finner gjennomsnittet av alle installasjonene fra en valgfri ketagori
function averageViews(obj, category) {
  let views = [];
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].category === category) {
      views.push(obj[i]["video views"])
    }
  }

  // for (let i = 0; i < views.length; i++) {
  //   views[i] = views[i].replaceAll(",", "")
  //   views[i] = views[i].replaceAll("+", "")
  // }

  //gjennomsnitt
  let sum = 0.0;
  for(let i = 0; i < views.length; i++) {
    sum += views[i];
  }
  
  return sum / views.length;
}


// finner de n mest populære appene innenfor en kategori
function popularYoutuber(obj, category, n) {
  let categoryApps = {};
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].category === category) {
      categoryApps[obj[i].Youtuber] = obj[i].subscribers;
    }
  }
  categoryApps = Object.entries(categoryApps); //gjør object til 2d array

  // for (let i = 0; i < categoryApps.length; i++) {
  //   categoryApps[i][1] = categoryApps[i][1].replaceAll(",", "")
  //   categoryApps[i][1] = categoryApps[i][1].replaceAll("+", "")
  //   categoryApps[i][1] = parseInt(categoryApps[i][1])
  // }

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
  mostPopularCategories.push({ 'Kategori': highestKeys[i][0], 'antall kanaler': highestKeys[i][1], 'gjennomsnittlige abonenter': Math.round(averageSubscribers(dataJson, highestKeys[i][0])), 'gjennomsnittlige totale seere': Math.round(averageViews(dataJson, highestKeys[i][0])) })
}
console.log();
console.log("Mest populære kategorier:");
console.table(mostPopularCategories);

//hviser de n mest populære spillene av de n mest populære kategoriene
let popularEntertainment = popularYoutuber(dataJson, 'Entertainment')
let popularMusic = popularYoutuber(dataJson, 'Music')
let popularPeopleBlogs = popularYoutuber(dataJson, 'People & Blogs')
let mostPopularYoutubers = [];
for (let i = 0; i < n; i++) {
  let category
  switch (i) {
    case 0: category = popularEntertainment; break;
    case 1: category = popularMusic; break;
    case 2: category = popularPeopleBlogs; break;
  }
  for (let j = 0; j < n; j++) {
    mostPopularYoutubers.push({ 'Kategori': highestKeys[i][0], 'Youtuber': category[j][0], 'Abonenter': category[j][1] })
  }
}
console.log();
console.log("Mest populære Youtuber-ene i kategoriene:");
console.table(mostPopularYoutubers);
