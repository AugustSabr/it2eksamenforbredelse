let antallKast = 0;
let kast1 = 0;
let kast2 = 0;
let like = false
while (!like) {
  antallKast++
  kast1 = Math.floor(Math.random()*6)+1
  kast2 = Math.floor(Math.random()*6)+1
  if (kast1 === kast2) {
    like = true
    console.log(kast1);
  }
}
console.log(antallKast);