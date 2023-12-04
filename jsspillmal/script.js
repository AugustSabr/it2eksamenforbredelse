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

class playerClass extends objectSuperclass {
  constructor(width, height, xpos, ypos, color) {
    super(width, height, xpos, ypos, color);
    this.speed = 0;
    this.xdirection = 0;
    this.ydirection = 0;
    this.points = 0;
  }
  move() {
    //resets direction
    this.xdirection = 0;
    this.ydirection = 0;

    //checks for direction inputs
    if (keysPressed["ArrowUp"] || keysPressed["w"]) {this.ydirection = -1;}
    if (keysPressed["ArrowDown"] || keysPressed["s"]) {this.ydirection = 1;}
    if (keysPressed["ArrowLeft"] || keysPressed["a"]) {this.xdirection = -1;}
    if (keysPressed["ArrowRight"] || keysPressed["d"]) {this.xdirection = 1;}

    //fixes diagonal movment
    if (this.xdirection !== 0 && this.ydirection !== 0) {
      const magnitude = Math.sqrt(2);
      this.xdirection /= magnitude;
      this.ydirection /= magnitude;
    }

    //updates player pos
    this.xpos = this.xpos + this.speed * this.xdirection;
    this.ypos = this.ypos + this.speed * this.ydirection;
    this.checkCollision()

    //check if player is in bounds
    if (this.xpos < 0) {
      this.xpos = 0;
    } else if (this.xpos + this.width > canvas.width) {
      this.xpos = canvas.width - this.width;
    }
    if (this.ypos < 0) {
      this.ypos = 0;
    } else if (this.ypos + this.height > canvas.height) {
      this.ypos = canvas.height - this.height;
    }
  }    

  checkCollision() {
    for (let i = 1; i < objList.length; i++) {
      if (objOverlap(this, objList[i])) {
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
            this.points++
            createSimpleEntitie("coin", 20, 20, '#FFBF00')
            continue;
          }
        }
        if (objList[i].constructor.name === "enemyClass") {
          alert("you die")
          startNewGame()
          break; //if the game is over, we do not need to keep
        }
      }
    }
  }
}

class enemyClass extends objectSuperclass {
  constructor(width, height, xpos, ypos, color, speed) {
    super(width, height, xpos, ypos, color);
    this.speed = speed;
    this.xdirection =  Math.random() < 0.5 ? -1 : 1;;
    this.ydirection = Math.random() < 0.5 ? -1 : 1;;
  }
  move() {
    this.xpos = this.xpos + this.speed * this.xdirection;
    this.ypos = this.ypos + this.speed * this.ydirection;
    this.checkCollision()

    if (this.xpos < 0 || this.xpos + this.width > canvas.width) {
      this.xdirection *= -1
    }
    if (this.ypos < 0 || this.ypos + this.height > canvas.height) {
      this.ydirection *= -1
    }
  }
  checkCollision() {
    for (let i = 1; i < objList.length; i++) {
      if (objOverlap(this, objList[i]) && objList[i].constructor.name === "simpleEntitieClass" && objList[i].type === "safeZone") {
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

class simpleEntitieClass extends objectSuperclass {
  constructor(type, width, height, xpos, ypos, color) {
    super(width, height, xpos, ypos, color);
    this.type = type;
  }
}

objList = []

const player = new playerClass()
function resetPlayer() {
  for (var member in keysPressed) delete keysPressed[member];
  player.width = 25;
  player.height = 25;
  player.xpos = 30;
  player.ypos = (canvas.height - 25) / 2;
  player.color = '#39FF14';
  player.speed = 2.0;
  player.xdirection = 0;
  player.ydirection = 0;
  player.points = 0;
  objList.push(player)
}

function createEnemy() {
  let width = 25;
  let height = 25;
  let speed = 2.0;
  const enemy = new enemyClass(width, height, 0, 0, '#FFFFFF', speed);

  unoccupiedSpace(enemy)

  objList.push(enemy);
}

function createSimpleEntitie(type, width, height, color) {
  const simpleEntitie = new simpleEntitieClass(type, width, height, 0, 0, color);

  if (type !== "safeZone") {
    unoccupiedSpace(simpleEntitie)
  }

  objList.push(simpleEntitie);
}

function unoccupiedSpace(obj) {
  let isColliding;
  do {
    isColliding = false;
    obj.ypos = Math.max(Math.random() * ctx.canvas.height - obj.width, 0);
    obj.xpos = Math.max(Math.random() * ctx.canvas.width - obj.height, 0);
    for (let i = 0; i < objList.length; i++) {
      if (objOverlap(obj, objList[i])) {
        isColliding = true;
        break;
      }
    }
  } while (isColliding);
}

const LEFT = "left", RIGHT = "right", UP = "up", DOWN = "down";
function shortestDistance(obj1, obj2) {
  let deltaX = Math.min(obj1.xpos + obj1.width, obj2.xpos + obj2.width) - Math.max(obj1.xpos, obj2.xpos);
  let deltaY = Math.min(obj1.ypos + obj1.height, obj2.ypos + obj2.height) - Math.max(obj1.ypos, obj2.ypos);
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
//handle inputs
const keysPressed = {};
document.addEventListener("keydown", function(event) {keysPressed[event.key] = true;});
document.addEventListener("keyup", function(event) {delete keysPressed[event.key];});

//check for overlap between two objects
function objOverlap(obj1, obj2) {
  return (
    obj1.xpos < obj2.xpos + obj2.width &&
    obj1.xpos + obj1.width > obj2.xpos &&
    obj1.ypos < obj2.ypos + obj2.height &&
    obj1.ypos + obj1.height > obj2.ypos
  )
}

//draws an object
function drawObject(obj) {
  ctx.beginPath();
  ctx.rect(obj.xpos, obj.ypos, obj.width, obj.height);
  ctx.fillStyle = obj.color;
  ctx.fill();
  ctx.closePath();
}

//starts a new game
function startNewGame() {
  objList = []
  resetPlayer()
  createSimpleEntitie("safeZone", 85, canvas.height, '#1E90FF')
  for (let i = 0; i < 2; i++) {
    createSimpleEntitie("obstacle", 100, 100, '#555555')
  }
  createSimpleEntitie("coin", 20, 20, '#FFBF00')
  createEnemy()
}
startNewGame()

//gameloop 
function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.move();

  // Draw the safe zone first
  for (let i = 0; i < objList.length; i++) {
    if (objList[i].type === "safeZone" || objList[i].type === "obstacle") {
      drawObject(objList[i]);
    }
  }

  for (let i = 0; i < objList.length; i++) {
    if (objList[i].type !== "safeZone" && objList[i].type !== "obstacle") {
      drawObject(objList[i]);
      if (objList[i].constructor.name === "enemyClass") {
        objList[i].move()
      }
    }
  }
  drawPoints()
}
setInterval(gameloop, 10);

function drawPoints() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Points: " + player.points, 10, 20);
}