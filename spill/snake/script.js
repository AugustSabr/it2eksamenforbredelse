const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 600;
ctx.canvas.height = 450;

class Snake {
  constructor() {
    this.width = 15;
    this.height = 15;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height / 2 - this.height / 2;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.tail = [];
    this.tailLength = 3;
    this.color = '#39FF14';
    this.speed = 5; // Juster denne variabelen for å endre slangehastigheten
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, this.width, this.height);
    }
  }

  update() {
    for (let i = this.tail.length - 1; i > 0; i--) {
      this.tail[i] = { ...this.tail[i - 1] };
    }
    if (this.tail.length > 0) {
      this.tail[0] = { x: this.x, y: this.y };
    }
    this.x += this.xSpeed * this.speed;
    this.y += this.ySpeed * this.speed;
    if (this.x >= canvas.width) this.x = 0;
    else if (this.x + this.width <= 0) this.x = canvas.width - this.width;
    if (this.y >= canvas.height) this.y = 0;
    else if (this.y + this.height <= 0) this.y = canvas.height - this.height;
  }

  changeDirection(direction) {
    switch (direction) {
      case 'ArrowUp':
        if (this.ySpeed !== this.height) {
          this.xSpeed = 0;
          this.ySpeed = -1;
        }
        break;
      case 'ArrowDown':
        if (this.ySpeed !== -1) {
          this.xSpeed = 0;
          this.ySpeed = 1;
        }
        break;
      case 'ArrowLeft':
        if (this.xSpeed !== this.width) {
          this.xSpeed = -1;
          this.ySpeed = 0;
        }
        break;
      case 'ArrowRight':
        if (this.xSpeed !== -1) {
          this.xSpeed = 1;
          this.ySpeed = 0;
        }
        break;
    }
  }

  eatFood(food) {
    if (this.x === food.x && this.y === food.y) {
      this.tail.push({});
      while (this.tail.length > this.tailLength) {
        this.tail.shift();
      }
      return true;
    }
    return false;
  }

  checkCollision() {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        return true;
      }
    }
    return false;
  }
}

class Food {
  constructor() {
    this.width = 15;
    this.height = 15;
    this.x = Math.floor(Math.random() * (canvas.width - this.width));
    this.y = Math.floor(Math.random() * (canvas.height - this.height));
    this.color = '#FFFF00';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const snake = new Snake();
let food = new Food();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.draw();
  food.draw();
}

function update() {
  snake.update();
  if (snake.eatFood(food)) {
    food = new Food();
  }
  if (snake.checkCollision()) {
    alert('Game Over');
    document.location.reload();
  }
  // Kollisjon med maten
  if (snake.x === food.x && snake.y === food.y) {
    food = new Food();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  snake.changeDirection(e.key);
});

gameLoop();
