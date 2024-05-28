const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to achieve a 3:4 ratio
ctx.canvas.width = 600
ctx.canvas.height = 450

let gameActive = false; // Flag indicating whether the game is currently active
let lastTime = 0; // Timestamp of the last frame rendered

let objList = [] // Array to store all game objects
let player; // Reference to the player object
let highScore =  localStorage.getItem("highScore") !== null ? localStorage.getItem("highScore") : 0;
let points = 0; // Initialize points earned by the player

const LEFT = "left", RIGHT = "right", UP = "up", DOWN = "down"; // Constants for direction checks

// Event listeners for keyboard input
const keysPressed = {};
document.addEventListener("keydown", function(event) {keysPressed[event.key] = true;});
document.addEventListener("keyup", function(event) {delete keysPressed[event.key];});

// Show start screen
function showStartScreen() {
  document.getElementById("start-screen").style.display = "block";
}

// Hide start screen
function hideStartScreen() {
  document.getElementById("start-screen").style.display = "none";
}

// Show death screen
function showDeathScreen(score) {
  gameActive = false; // Set gameActive to false when showing the death screen
  if (points > highScore) {
    highScore = points;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("death-screen").style.display = "block";
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("score").textContent = score;
}

// Hide death screen
function hideDeathScreen() {
    document.getElementById("death-screen").style.display = "none";
}

// Event listener for start- and restartbutton
document.getElementById("start-button").addEventListener("click", startNewGame);
document.getElementById("restart-button").addEventListener("click", startNewGame);

// Base class for game objects
class objectSuperClass {
  constructor(width, height, xpos, ypos, color) {
    this.width = width;
    this.height = height;
    this.xpos = xpos;
    this.ypos = ypos;
    this.color = color;
  }
}

// Player class inheriting from objectSuperClass
class playerClass extends objectSuperClass {
  constructor(width, height, xpos, ypos, color) {
    super(width, height, xpos, ypos, color);
    this.speed = 0;
    this.xdirection = 0;
    this.ydirection = 0;
  }
  // Move player based on keyboard input
  move(deltaTime) {
    //resets direction
    this.xdirection = 0;
    this.ydirection = 0;

    // Checks for direction inputs
    if (keysPressed["ArrowUp"] || keysPressed["w"]) {this.ydirection = -1;}
    if (keysPressed["ArrowDown"] || keysPressed["s"]) {this.ydirection = 1;}
    if (keysPressed["ArrowLeft"] || keysPressed["a"]) {this.xdirection = -1;}
    if (keysPressed["ArrowRight"] || keysPressed["d"]) {this.xdirection = 1;}

    const newPos = moveObject(this, deltaTime)
    this.xpos = newPos[0];
    this.ypos = newPos[1];

    // Ensure player stays within canvas bounds
    if (this.xpos < 0) {
      this.xpos = 0;
    } else if (this.xpos + this.width > ctx.canvas.width) {
      this.xpos = ctx.canvas.width - this.width;
    }
    if (this.ypos < 0) {
      this.ypos = 0;
    } else if (this.ypos + this.height > ctx.canvas.height) {
      this.ypos = ctx.canvas.height - this.height;
    }

    this.checkCollision()
  }    
  // Check collision with other game objects
  checkCollision() {
    for (let i = 1; i < objList.length; i++) { // Start from 1 to avoid self-collision
      if (checkObjectOverlap(this, objList[i])) {
        if (objList[i].constructor.name === "simpleEntitieClass") {
          if (objList[i].type === "obstacle") {
            switch (shortestDistance(this, objList[i])) {
              case LEFT: this.xpos = objList[i].xpos - this.width; break;
              case RIGHT: this.xpos = objList[i].xpos + objList[i].width; break;
              case UP: this.ypos = objList[i].ypos - this.height; break;
              case DOWN: this.ypos = objList[i].ypos + objList[i].height; break;
            }
            continue;
          } else if (objList[i].type === "coin") {
            objList.splice(i, 1)
            points++
            createSimpleEntity("coin", 20, 20, -1, -1, '#FFBF00')
            continue;
          }
        }
        if (objList[i].constructor.name === "enemyClass") {
          showDeathScreen(points)
          break;
        }
      }
    }
  }
}
// Enemy class inheriting from objectSuperclass
class enemyClass extends objectSuperClass {
  constructor(width, height, xpos, ypos, color, speed) {
    super(width, height, xpos, ypos, color);
    this.speed = speed;
    this.xdirection =  Math.random() < 0.5 ? -1 : 1;
    this.ydirection = Math.random() < 0.5 ? -1 : 1;
  }
  // Move enemy and handle collision
  move(deltaTime) {
    const newPos = moveObject(this, deltaTime)

    // Check if the new position will cause the enemy to go out of bounds
    if (newPos[0] < 0 || newPos[0] + this.width > ctx.canvas.width) {
      this.xdirection *= -1;
    } else {
      this.xpos = newPos[0];
    }
    if (newPos[1] < 0 || newPos[1] + this.height > ctx.canvas.height) {
      this.ydirection *= -1;
    } else {
      this.ypos = newPos[1];
    }
    this.checkCollision()
  }
  // Check collision with other game objects
  checkCollision() {
    for (let i = 1; i < objList.length; i++) { // Start from 1 because collision with player is handled in player's checkCollision method
      if (checkObjectOverlap(this, objList[i]) && objList[i].constructor.name === "simpleEntitieClass" && objList[i].type === "safeZone") {
        switch (shortestDistance(this, objList[i])) {
          case LEFT: this.xdirection = -1; break;
          case RIGHT: this.xdirection = 1; break;
          case UP: this.ydirection = -1; break;
          case DOWN: this.ydirection = 1; break;
        }
        break;
      }
    }
  }
}
// Class for simple game entities like coins and obstacles
class simpleEntitieClass extends objectSuperClass {
  constructor(width, height, xpos, ypos, color, type) {
    super(width, height, xpos, ypos, color);
    this.type = type;
  }
}

function moveObject(obj, deltaTime) {
  // Fixes diagonal movment
  let magnitude = 1;
  if (obj.xdirection !== 0 && obj.ydirection !== 0) {
    magnitude = Math.sqrt(2);
  }
  const newX = obj.xpos + obj.speed * (obj.xdirection / magnitude) * deltaTime;
  const newY = obj.ypos + obj.speed * (obj.ydirection / magnitude) * deltaTime;
  return [newX, newY];
}

// Function to reset player position and state
function createPlayer() {
  for (let member in keysPressed) delete keysPressed[member];
  player = new playerClass()
  player.width = 25;
  player.height = 25;
  player.xpos = 30;
  player.ypos = (ctx.canvas.height - 25) / 2;
  player.color = '#39FF14';
  player.speed = 200.0;
  player.xdirection = 0;
  player.ydirection = 0;
  objList.push(player)
}

// Function to create a new enemy object
function createEnemy(width, height, color, speed) {
  const position = unoccupiedSpace(width, height);
  const enemy = new enemyClass(width, height, position[0], position[1], color, speed);
  objList.push(enemy);
}

// Function to create a new simple entity like coins or obstacles
function createSimpleEntity(type, width, height, xpos, ypos, color) {
  let position = [xpos, ypos]
  if (xpos < 0 || ypos < 0 || xpos > ctx.canvas.width || ypos > ctx.canvas.height) { // if the position set is outside the canvas, its moved to an unoccupied space
    position = unoccupiedSpace(width, height);
  }
  const simpleEntitie = new simpleEntitieClass(width, height, position[0], position[1], color, type);
  objList.push(simpleEntitie);
}

// Function to find unoccupied space on canvas
function unoccupiedSpace(width, height) {
  let isColliding;
  let xpos, ypos;
  do {
    isColliding = false;
    xpos = Math.random() * (ctx.canvas.width - width);
    ypos = Math.random() * (ctx.canvas.height - height);
    for (let i = 0; i < objList.length; i++) {
      if (checkObjectOverlap({xpos: xpos, ypos: ypos, width: width, height: height}, objList[i])) {
        isColliding = true;
        break;
      }
    }
  } while (isColliding);
  return [xpos, ypos]
}

// Function to determine shortest distance between two objects
function shortestDistance(obj1, obj2) {
  const deltaX = Math.min(obj1.xpos + obj1.width, obj2.xpos + obj2.width) - Math.max(obj1.xpos, obj2.xpos);
  const deltaY = Math.min(obj1.ypos + obj1.height, obj2.ypos + obj2.height) - Math.max(obj1.ypos, obj2.ypos);
  if (deltaX < deltaY) {
    if (obj1.xpos < obj2.xpos) {
      return LEFT
    } else {
      return RIGHT
    }
  } else {
    if (obj1.ypos < obj2.ypos) {
      return UP
    } else {
      return DOWN
    }
  }
}

// Function to check for overlap between two objects
function checkObjectOverlap(obj1, obj2) {
  return (
    obj1.xpos < obj2.xpos + obj2.width &&
    obj1.xpos + obj1.width > obj2.xpos &&
    obj1.ypos < obj2.ypos + obj2.height &&
    obj1.ypos + obj1.height > obj2.ypos
  )
}

// Function to draw a game object
function drawObject(obj) {
  ctx.beginPath();
  ctx.rect(obj.xpos, obj.ypos, obj.width, obj.height);
  ctx.fillStyle = obj.color;
  ctx.fill();
  ctx.closePath();
}

// Function to start a new game
function startNewGame() {
  gameActive = true; // Set gameActive to true when starting a new game
  hideStartScreen();
  hideDeathScreen();
  objList = [];
  points = 0;
  createPlayer();
  createSimpleEntity("safeZone", 85, ctx.canvas.height, 0, 0, '#1E90FF');
  createSimpleEntity("safeZone", 85, ctx.canvas.height, 600-85, 0, '#1E90FF');
  createSimpleEntity("obstacle", 100, 100, -1, -1, '#555555');
  createSimpleEntity("coin", 20, 20, -1, -1, '#FFBF00');
  createEnemy(25, 25, '#FFFFFF', 200.0);
}

// Main game loop
function gameloop(timestamp) {
  if (gameActive) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const deltaTime = (timestamp - lastTime) / 1000; // Convert milliseconds to seconds
    lastTime = timestamp;
    player.move(deltaTime);

    // Draw simpleEntitieClass first 
    for (let i = 1; i < objList.length; i++) {
      if (objList[i].constructor.name === "simpleEntitieClass") {
        drawObject(objList[i]);
      }
    }

    // Move and draw enemy objects
    for (let i = 1; i < objList.length; i++) {
      if (objList[i].constructor.name === "enemyClass") {
        drawObject(objList[i]);
        objList[i].move(deltaTime)
      }
    }
    // Draw player last so it appaer on top
    drawObject(player);
    drawPoints();
    requestAnimationFrame(gameloop);
  } else {
    requestAnimationFrame(gameloop);
  }
}
requestAnimationFrame(gameloop);

// Function to draw points on canvas
function drawPoints() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Points: " + points, 10, 20);
}

// Display the start screen when the page loads
showStartScreen();
//startNewGame();