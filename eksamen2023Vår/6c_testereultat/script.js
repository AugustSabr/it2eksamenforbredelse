const testResults = [30, 65, 82, 97, 102, 0, 50, 69, 70, 89, 90, 100, -1]

for (let i = 0; i < testResults.length; i++) {
    getResultUtenFeil(testResults[i]);
}

// funksjonen sjekker kun om resultatet faller mellom spesifike verdier, men ikke om resultatet er lik noen av de spesifike verdiene. F.eks er 50 et ugyldig resultat fordi det ikke er mindre en 50 eller større en 50.
// funksjonen gjør også at alle resultater under 50 blir ikke bestått, selv -1.
function getResultMedFeil(int) {
    if (int < 50) {
        console.log("Ikke bestått");
    } else if (50 < int && int < 69){
        console.log("Bestått");
    } else if (70 < int && int < 89){
        console.log("Godt bestått");
    } else if (90 < int && int < 100){
        console.log("Meget godt bestått");
    } else {
        console.log("Ikke gyldig poengsum!");
    }
}

function getResultUtenFeil(int) {
    if (int < 0 || int > 100 ) {
        console.log("Ikke gyldig poengsum!");
    } else if (int < 50){
        console.log("Ikke bestått");
    } else if (int < 70){
        console.log("Bestått");
    } else if (int < 90){
        console.log("Godt bestått");
    } else if (int <= 100){
        console.log("Meget godt bestått");
    } else {
        console.log("Ikke gyldig poengsum!");
    }
}


// PRINT "Skriv inn poengsummen din:"
// READ poengsum
// IF poengsum LESSER THAN 50
//   PRINT "Ikke bestått"  
// ELSE IF poengsum GREATER THAN 50 AND poengsum LESSER THAN 69
//   PRINT "Bestått"     
// ELSE IF poengsum GREATER THAN 70 AND poengsum LESSER THAN 89
//   PRINT "Godt bestått"      
// ELSE IF poengsum GREATER THAN 90 AND poengsum LESSER THAN 100
//   PRINT "Meget godt bestått"         
// ELSE
//   PRINT "Ikke gyldig poengsum!"
// ENDIF