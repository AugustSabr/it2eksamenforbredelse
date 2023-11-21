const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 600; //4*150
ctx.canvas.height = 450; //3*150


class objectSuperclass {
  constructor(xpos, ypos, color) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.color = color;
  }
}

class Paddle extends objectSuperclass{
  constructor(width, height, xpos, ypos, color, speed) {
    super(xpos, ypos, color);
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = 0;
  }

  move() {
    this.ypos += this.direction * this.speed;
    if (this.ypos < 0) {
      this.ypos = 0;
    } else if (this.ypos + this.height > canvas.height) {
      this.ypos = canvas.height - this.height;
    }
  }
}

class Ball extends objectSuperclass{
  constructor(xpos, ypos, radius, color, speedX, speedY) {
    super(xpos, ypos, color);
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  move() {
    this.xpos += this.speedX;
    this.ypos += this.speedY;

    if (this.ypos + this.radius > canvas.height || this.ypos - this.radius < 0) {
      this.speedY = -this.speedY;
    }
  }
}

const paddle1 = new Paddle(20, 100, 10, canvas.height / 2 - 50, "#FFFFFF", 5);
const paddle2 = new Paddle(20, 100, canvas.width - 30, canvas.height / 2 - 50, "#FFFFFF", 5);
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, "#FFFF00", 4, 4);

function drawPaddle(paddle) {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.xpos, paddle.ypos, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.xpos, ball.ypos, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

let scorePlayer1 = 0;
let scorePlayer2 = 0;

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Player 1: " + scorePlayer1, 50, 50);
  ctx.fillText("Player 2: " + scorePlayer2, canvas.width - 150, 50);
}

function checkScore() {
  if (ball.xpos - ball.radius < 0) {
    scorePlayer2++;
    resetBall();
  } else if (ball.xpos + ball.radius > canvas.width) {
    scorePlayer1++;
    resetBall();
  }
}

function resetBall() {
  ball.xpos = canvas.width / 2;
  ball.ypos = canvas.height / 2;
  ball.speedX = -ball.speedX;
  ball.speedY = Math.random() * 8 - 4;
}

const collisionChangeProbability = 0.3; //30%

function handlePaddleCollision(paddle) {
  const hitCenter = (ball.ypos - (paddle.ypos + paddle.height / 2)) / (paddle.height / 2);
  ball.speedY = hitCenter * 5; 

  if (Math.random() < collisionChangeProbability) {
    ball.speedY *= -1;
  }

  ball.speedX = -ball.speedX;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(paddle1);
  drawPaddle(paddle2);
  drawBall();

  drawScore();
  checkScore();

  paddle1.move();
  paddle2.move();
  ball.move();

  // Ball hits paddles
  if (
    ball.xpos - ball.radius < paddle1.xpos + paddle1.width &&
    ball.ypos > paddle1.ypos &&
    ball.ypos < paddle1.ypos + paddle1.height
  ) {
    handlePaddleCollision(paddle1);
  } else if (
    ball.xpos + ball.radius > paddle2.xpos &&
    ball.ypos > paddle2.ypos &&
    ball.ypos < paddle2.ypos + paddle2.height
  ) {
    handlePaddleCollision(paddle2);
  }

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  switch (e.key) {
    case "w":
      paddle1.direction = -1;
      break;
    case "s":
      paddle1.direction = 1;
      break;
    case "ArrowUp":
      paddle2.direction = -1;
      break;
    case "ArrowDown":
      paddle2.direction = 1;
      break;
  }
}

function keyUpHandler(e) {
  switch (e.key) {
    case "w":
    case "s":
      paddle1.direction = 0;
      break;
    case "ArrowUp":
    case "ArrowDown":
      paddle2.direction = 0;
      break;
  }
}

draw();
