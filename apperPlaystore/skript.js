const dataJson = require('./googleplaystore.json');

let categories = [];
for (let i = 0; i < dataJson.length; i++) {
  categories.push(dataJson[i].Category)
}
categories.sort()

let categoriesNumbered = {}
let caunts = []
let caunt = 1;
for (let i = 0; i < categories.length; i++) {
  if (categories[i] === categories[i+1]) {
    caunt++;
  } else {
    categoriesNumbered[categories[i]] = caunt;
    caunts.push(caunt)
    caunt = 1
  }
}

caunts.sort(function(a, b){return a - b})
var most = []
for (let i = 0; i < 3; i++) {
  most.push(caunts[caunts.length-3+i]) 
}


console.log(most);
console.log(caunts);
// console.log(categoriesNumbered)

