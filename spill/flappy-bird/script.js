const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 600;
ctx.canvas.height = 450;

let frames = 0;

class Bird {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = 0;
    this.gravity = 0.5;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  flap() {
    this.velocity = -8;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    // Add collision detection or boundary logic here
  }
}

const bird = new Bird(50, canvas.height / 2, 20, "red");

const obstacles = []; // Array for å lagre hindringer

// Funksjon for å generere hindringer
function generateObstacle() {
  const minHeight = 50;
  const gap = 150;
  const maxHeight = canvas.height - gap - minHeight;

  const heightTop = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

  obstacles.push({
    x: canvas.width,
    yTop: 0,
    heightTop: heightTop,
    gap: gap,
    width: 50,
    color: "green"
  });

  obstacles.push({
    x: canvas.width,
    yTop: heightTop + gap,
    heightTop: canvas.height - heightTop - gap,
    gap: gap,
    width: 50,
    color: "green"
  });
}

// Funksjon for å tegne hindringer
function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.yTop, obstacle.width, obstacle.heightTop);
  }
}

// Funksjon for å oppdatere hindringer
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    obstacle.x -= 2; // Juster denne verdien for å endre hindringshastigheten

    // Slett hindringer som har gått forbi skjermen
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(i, 1);
      i--;
    }
  }

  // Generer nye hindringer med jevne mellomrom
  if (frames % 120 === 0) { // Juster dette tallet for å endre avstanden mellom hindringer
    generateObstacle();
  }
}

function checkCollision() {
  if (bird.y + bird.radius > canvas.height) {
    location.reload();
  }

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    if (
      bird.x < obstacle.x + obstacle.width &&
      bird.x + bird.radius > obstacle.x &&
      bird.y < obstacle.yTop + obstacle.heightTop &&
      bird.y + bird.radius > obstacle.yTop
    ) {
      location.reload();
    }

    // // Kollisjon med mellomrommet mellom hindringene
    // if (
    //   bird.x < obstacle.x + obstacle.width &&
    //   bird.x + bird.radius > obstacle.x &&
    //   (bird.y < obstacle.yTop + obstacle.heightTop || bird.y + bird.radius > obstacle.yTop + obstacle.gap)
    // ) {
    //   // Spillet er over, implementer logikk for spillslutt her
    //   // For eksempel: 
    //   // alert("Game Over!");
    //   // location.reload(); // for å starte spillet på nytt
    // }
  }
}

function draw() {
  frames++
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.draw();
  drawObstacles(); // Tegn hindringer
  bird.update();
  updateObstacles(); // Oppdater hindringer
  checkCollision();
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.flap();
  }
});

draw();
