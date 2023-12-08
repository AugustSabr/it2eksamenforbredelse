const tall1 = [7, 24, 10, 26, 35, 10, 29, 2, 29, 40, 40, 26, 16, 8, 9, 26, 5, 18, 9, 13, 40, 28, 37, 32, 6, 11, 35, 9, 26, 6, 11, 2, 10, 11, 27, 4, 8, 22, 40, 19];
const tall2 = [56, 49, 28, 52, 58, 33, 26, 27, 58, 36, 36, 48, 55, 25, 58, 57, 30, 27, 36, 39, 58, 50, 58, 28, 56, 52, 21, 39, 22, 27, 48, 37, 20, 32, 38, 31, 31, 25, 42, 54];

// Fjerner duplikanter fra en array
function fjernDuplikater(array) {
  var unike = [];
  for (var i = 0; i < array.length; i++) {
      if (unike.indexOf(array[i]) === -1) {
          unike.push(array[i]);
      }
  }
  return unike;
}

// Finner og skriver ut alle tallene som finnes i begge listene
function finnFellesTall(liste1, liste2) {
  var fellesTall = [];
  var kortereListe;
  var lengreListe;

  if (liste1.length <= liste2.length) {
    kortereListe = fjernDuplikater(liste1);
    lengreListe = fjernDuplikater(liste2);
  } else {
    kortereListe = fjernDuplikater(liste2);
    lengreListe = fjernDuplikater(liste1);
  }

  for (var i = 0; i < lengreListe.length; i++) {
    if (kortereListe.indexOf(lengreListe[i]) !== -1) {
      fellesTall.push(lengreListe[i]);
    }
  }

  return fjernDuplikater(fellesTall);
}


// Fjerner alle tallene som ikke finnes i begge listene
function IkkeFellesTall(liste1, liste2) {
  var fellesTall = finnFellesTall(liste1, liste2);
  liste1 = fjernDuplikater(liste1);
  liste2 = fjernDuplikater(liste2);
  var nyListe1 = [];
  var nyListe2 = [];

  for (var i = 0; i < liste1.length; i++) {
      if (fellesTall.indexOf(liste1[i]) === -1) {
          nyListe1.push(liste1[i]);
      }
  }

  for (var j = 0; j < liste2.length; j++) {
      if (fellesTall.indexOf(liste2[j]) === -1) {
          nyListe2.push(liste2[j]);
          // nyListe1.push(liste1[i]);
      }
  }

  return [nyListe1, nyListe2];
  // return nyListe1;
}

//a
// console.log(fjernDuplikater(tall1));
// console.log(fjernDuplikater(tall2));

//b
// console.log(finnFellesTall(tall1, tall2));

//c
// console.log(IkkeFellesTall(tall1, tall2));