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
  move() {
    this.ydirection = 0
    this.xdirection = 0
    switch (this.lastDirection) {
      case 'up': this.ydirection = -1; break;
      case 'down': this.ydirection = 1; break;
      case 'right': this.xdirection = 1; break;
      case 'left': this.xdirection = -1; break;
    }
  
    if (
      this.xpos < 0 ||
      this.xpos + this.width > canvas.width ||
      this.ypos < 0 ||
      this.ypos + this.height > canvas.height
    ) {startNewGame();}
  
    this.xpos = this.xpos + this.speed * this.xdirection;
    this.ypos = this.ypos + this.speed * this.ydirection;
  }
}

class foodclass extends objectSuperclass {
  constructor(width, height, xpos, ypos, color, eatable) {
    super(width, height, xpos, ypos, color);
    this.eatable = eatable;
  }
}

let objList = []
const player = new playerclass(25, 25, (canvas.width - 25) / 2, (canvas.height - 25) / 2, '#39FF14', undefined, undefined, undefined, undefined)

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

let takenCoordinates = [];

function createFood() {
  const food = new foodclass(25, 25, 0, 0, '#FFFF00', true);
  do {
    food.xpos = Math.max(Math.random() * ctx.canvas.width - 25, 0);
    food.ypos = Math.max(Math.random() * ctx.canvas.height - 25, 0);
  } while (checkCollisions(food) || objOverlap(food, player));

  objList.push(food);
  takenCoordinates.push([food.xpos, food.ypos]);
}

function makeWall(x, y) {
  const wall = new foodclass(25, 25, x, y, '#808080', false);
  objList.push(wall);
}

let points = 0;
let newWalls = []
function checkCollisions(obj) {
  for (let i = 1; i < objList.length; i++) {
    if (objOverlap(obj, objList[i])) {
      if (obj === player) {
        if (objList[i].eatable === true) {
          newWalls.push([objList[i].xpos, objList[i].ypos]);
          points++;
          player.speed += 0.1 
          objList.splice(i, 1);
          createFood();
        } else {
          startNewGame()
        }
      }
      return true
    }
  }

  if (newWalls.length !== 0) {
    for (let i = newWalls.length - 1; i >= 0; i--) {
      if (!objOverlap(player, { xpos: newWalls[i][0], ypos: newWalls[i][1], width: 25, height: 25 })) {
        makeWall(newWalls[i][0], newWalls[i][1]);
        newWalls.splice(i, 1);
      }
    }
  }
}

function objOverlap(obj1, obj2) {
  return (
    obj1.xpos < obj2.xpos + obj2.width &&
    obj1.xpos + obj1.width > obj2.xpos &&
    obj1.ypos < obj2.ypos + obj2.height &&
    obj1.ypos + obj1.height > obj2.ypos
  )
}

function startNewGame() {
  player.speed = 1.0
  objList = []
  objList.push(player)

  createFood()
  createFood()
  createFood()

  player.xpos = (canvas.width - player.width) / 2;
  player.ypos = (canvas.height - player.height) / 2;
  player.lastDirection = undefined;
  
  points = 0;
}
startNewGame()


//draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < objList.length; i++) {
    drawObject(objList[i])
  }
  player.move()
  checkCollisions(player)
  drawPoints()
}

function drawPoints() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Points: " + points, 10, 20);
}
setInterval(draw, 10);