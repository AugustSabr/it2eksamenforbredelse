// declaring variables
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 600 //4*150
ctx.canvas.height = 450 //3*150

class objectSuperclass {
  constructor(width, height, xpos, ypos, color) {
    this.width = width;
    this.height = height;
    this.xpos = xpos;
    this.ypos = ypos;
    this.color = color;
  }
}

class playerclass extends objectSuperclass {
  constructor(width, height, xpos, ypos, color, speed, xdirection, ydirection, lastDirection) {
    super(width, height, xpos, ypos, color);
    this.speed = speed;
    this.xdirection = xdirection;
    this.ydirection = ydirection;
    this.lastDirection = lastDirection;
  }
}

class foodclass extends objectSuperclass {
  constructor(width, height, xpos, ypos, color, eatable) {
    super(width, height, xpos, ypos, color);
    this.eatable = eatable;
  }
}

let objList = []
const player = new playerclass(25, 25, (canvas.width - 25) / 2, (canvas.height - 25) / 2, '#39FF14', 3, undefined, undefined, undefined)
objList.push(player)

//keyHandlers
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  switch (e.key) {
    case "ArrowUp": upPressed = true; player.lastDirection = "up"; break;
    case "ArrowDown": downPressed = true; player.lastDirection = "down"; break;
    case "ArrowRight": rightPressed = true; player.lastDirection = "right"; break;
    case "ArrowLeft": leftPressed = true; player.lastDirection = "left"; break;
  }
}

function keyUpHandler(e) {
  switch (e.key) {
    case "ArrowUp": upPressed = false; break;
    case "ArrowDown": downPressed = false; break;
    case "ArrowRight": rightPressed = false; break;
    case "ArrowLeft": leftPressed = false; break;
  }
}

//player
// const player = new playerclass(25, 25, (canvas.width - 25) / 2, (canvas.height - 25) / 2, '#39FF14', 3)
// const playerWidth = 25;
// const playerHeight = 25;
// let playerPosX = (canvas.width - playerWidth) / 2;
// let playerPosY = (canvas.height - playerHeight) / 2;
// const playerSpeed = 3;
// const playerColor = '#39FF14'


function drawObject(obj) {
  ctx.beginPath();
  ctx.rect(obj.xpos, obj.ypos, obj.width, obj.height);
  ctx.fillStyle = obj.color;
  ctx.fill();
  ctx.closePath();
}

function movePlayer() {
  player.ydirection = 0
  player.xdirection = 0
  switch (player.lastDirection) {
    case 'up': player.ydirection = -1; break;
    case 'down': player.ydirection = 1; break;
    case 'right': player.xdirection = 1; break;
    case 'left': player.xdirection = -1; break;
  }

  player.xpos = Math.min(Math.max(player.xpos + player.speed * player.xdirection, 0), canvas.width - player.width);
  player.ypos = Math.min(Math.max(player.ypos + player.speed * player.ydirection, 0), canvas.height - player.height);
}

let takenCoordinates = [];

function createFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * ctx.canvas.width / 25) * 25;
    y = Math.floor(Math.random() * ctx.canvas.height / 25) * 25;
  } while (isCoordinatesTaken(x, y));

  const food = new foodclass(25, 25, x, y, '#FFFF00', true);
  objList.push(food);
  takenCoordinates.push([x, y]);
}

function isCoordinatesTaken(x, y) {
  for (let i = 0; i < takenCoordinates.length; i++) {
    if (x === takenCoordinates[i][0] && y === takenCoordinates[i][1]) {
      console.log('wawaw');
      return true; // Coordinates are taken
    }
  }
  return false; // Coordinates are not taken
}

function makeWall(obj) {
  obj.color = '#808080';
  obj.eatable = false;
}

createFood()
createFood()
createFood()
makeWall(objList[1])

//draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < objList.length; i++) {
    drawObject(objList[i])
  }
  movePlayer()
}

setInterval(draw, 10);