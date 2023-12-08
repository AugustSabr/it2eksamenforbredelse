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
    this.inventory = [];
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
    for (let i = 0; i < objList.length; i++) {
      if (this !== objList[i] && objOverlap(this, objList[i])) {
        if (objList[i].constructor.name === "simpleEntitieClass") {
          if (objList[i].type === "obstacle") {
            switch (shortestDistance(this, objList[i])) {
              case LEFT: this.xpos = objList[i].xpos - this.width; break;
              case RIGHT: this.xpos = objList[i].xpos + objList[i].width; break;
              case UP: this.ypos = objList[i].ypos - this.height; break;
              case DOWN: this.ypos = objList[i].ypos + objList[i].height; break;
            }
            continue;
          } else if (objList[i].type === "sheep" && this.xpos > canvas.width-85) {
              if (player.inventory.length === 0) {
                player.inventory.push(objList[i]);
                objList.splice(i, 1);
                player.speed = 1.5
                continue;
              } else {
                alert("you die, by more than one sheep")
                startNewGame()
                break; //if the game is over, we do not need to keep
              }
          } else if (objList[i].type === "safeZone1" && player.inventory.length !== 0) {
            player.inventory[0].xpos = player.xpos - 30;
            player.inventory[0].ypos = player.ypos;
            objList.push(player.inventory[0])
            player.inventory.splice(0, 1);
            player.speed = 2.0
            this.points++
            createSimpleEntitie("sheep", 20, 20, undefined, undefined, '#FFFFFF')
            createSimpleEntitie("obstacle", Math.random() * 50 + 50, Math.random() * 50 + 50, undefined, undefined, '#964B00')
            createEnemy()
            objList.sort(customSort);
            continue;
          }
        }
        if (objList[i].constructor.name === "enemyClass") {
          alert("you die, by ghost")
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
    this.xdirection =  Math.random() < 0.5 ? Math.random()*-1 : Math.random();
    this.ydirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random();
    let magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
    this.xdirection /= magnitude;
    this.ydirection /= magnitude;
  }
  move() {
    this.xpos = this.xpos + this.speed * this.xdirection;
    this.ypos = this.ypos + this.speed * this.ydirection;
    this.checkCollision()

    if (this.xpos < 0 || this.xpos + this.width > canvas.width) {
      this.xdirection *= -1;
      this.ydirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random()
      let magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
      this.xdirection /= magnitude;
      this.ydirection /= magnitude;
    }
    if (this.ypos < 0 || this.ypos + this.height > canvas.height) {
      this.ydirection *= -1;
      this.xdirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random()
      let magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
      this.xdirection /= magnitude;
      this.ydirection /= magnitude;
    }
  }
  checkCollision() {
    for (let i = 0; i < objList.length; i++) {
      if (objOverlap(this, objList[i]) && objList[i].constructor.name === "simpleEntitieClass" && objList[i].type.includes("safeZone")) {
        let magnitude;
        switch (shortestDistance(this, objList[i])) {
          case LEFT:
            this.xdirection *= -1;
            this.ydirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random();
            magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
            this.xdirection /= magnitude;
            this.ydirection /= magnitude;
            break;
          case RIGHT:
            this.xdirection *= -1;
            this.ydirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random();
            magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
            this.xdirection /= magnitude;
            this.ydirection /= magnitude;
            break;
          case UP:
            this.ydirection *= -1;
            this.xdirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random();
            magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
            this.xdirection /= magnitude;
            this.ydirection /= magnitude;
            break;
          case DOWN:
            this.ydirection *= -1;
            this.xdirection = Math.random() < 0.5 ? Math.random()*-1 : Math.random();
            magnitude = Math.sqrt(this.xdirection ** 2 + this.ydirection ** 2);
            this.xdirection /= magnitude;
            this.ydirection /= magnitude;
            break;
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
  player.inventory = [];
  objList.push(player)
}

function createEnemy() {
  let width = 25;
  let height = 25;
  let speed = 2.0;
  const enemy = new enemyClass(width, height, 0, 0, '#D80000', speed);

  placeObjectInUnoccupiedSpace(enemy, [])

  objList.push(enemy);
}

function createSimpleEntitie(type, width, height, xpos, ypos, color) {
  const simpleEntitie = new simpleEntitieClass(type, width, height, xpos, ypos, color);

  if (xpos === undefined || ypos === undefined) {
    placeObjectInUnoccupiedSpace(simpleEntitie, [])

    if (type === "sheep") {
      for (let i = 0; i < objList.length; i++) {
        if (objList[i].type === "safeZone2") {
          while (simpleEntitie.xpos < objList[i].xpos) {
            placeObjectInUnoccupiedSpace(simpleEntitie, [objList[i]])
          }
          break; //there is only one safeZone2
        }        
      }
    }
  }

  objList.push(simpleEntitie);
}

function placeObjectInUnoccupiedSpace(obj, list) {
  let isColliding;
  do {
    isColliding = false;
    obj.ypos = Math.max(Math.random() * ctx.canvas.height - obj.width, 0);
    obj.xpos = Math.max(Math.random() * ctx.canvas.width - obj.height, 0);
    for (let i = 0; i < objList.length; i++) {
      if (objOverlap(obj, objList[i]) && !list.includes(objList[i])) {
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

function customSort(a, b) {
  const classOrder = {
    "simpleEntitieClass": 0,
    "enemyClass": 1,
    "playerClass": 2
  };
  const typeOrder = {
    "safeZone1": 0,
    "safeZone2": 1,
    "obstacle": 2,
    "sheep": 3
  };

  if (a.constructor.name !== b.constructor.name) {
    return classOrder[a.constructor.name] - classOrder[b.constructor.name];
  }
  if (a.constructor.name === "simpleEntitieClass") {
    return typeOrder[a.type] - typeOrder[b.type];
  }
  return 0;
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
  createSimpleEntitie("safeZone1", 85, canvas.height, 0, 0, '#2C6D08')
  createSimpleEntitie("safeZone2", 85, canvas.height, canvas.width-85, 0, '#2C6D08')
  for (let i = 0; i < 3; i++) {
    createSimpleEntitie("obstacle", Math.random() * 50 + 50, Math.random() * 50 + 50, undefined, undefined, '#964B00')
    createSimpleEntitie("sheep", 20, 20, undefined, undefined, '#FFFFFF')
  }
  createEnemy()
  objList.sort(customSort);
}
startNewGame()

//gameloop 
function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw
  for (let i = 0; i < objList.length; i++) {
    drawObject(objList[i]);
    if (objList[i].constructor.name === "enemyClass") {
      objList[i].move()
    }
  }
  player.move();
  drawPoints()
}
setInterval(gameloop, 10);

function drawPoints() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Points: " + player.points, 10, 20);
}