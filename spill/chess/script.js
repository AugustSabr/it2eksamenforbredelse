const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 480;
ctx.canvas.height = 480;

class ChessPiece {
  constructor(x, y, color, type) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x * 60 + 30, this.y * 60 + 30, 20, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Board {
  constructor() {
    this.board = this.createBoard();
    this.pieces = this.setupPieces();
  }

  createBoard() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = [];
      for (let j = 0; j < 8; j++) {
        board[i][j] = null;
      }
    }
    return board;
  }

  setupPieces() {
    const pieces = [];

    for (let i = 0; i < 8; i++) {
      pieces.push(new ChessPiece(i, 1, "black", "pawn"));
      pieces.push(new ChessPiece(i, 6, "white", "pawn"));
    }

    pieces.push(new ChessPiece(0, 0, "black", "rook"));
    pieces.push(new ChessPiece(7, 0, "black", "rook"));
    pieces.push(new ChessPiece(0, 7, "white", "rook"));
    pieces.push(new ChessPiece(7, 7, "white", "rook"));

    return pieces;
  }

  drawBoard() {
    let color = true;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = color ? "#d18b47" : "#ffce9e";
        ctx.fillRect(i * 60, j * 60, 60, 60);
        color = !color;
      }
      color = !color;
    }
  }

  drawPieces() {
    this.pieces.forEach(piece => {
      piece.draw();
    });
  }

  movePiece(piece, targetX, targetY) {
    if (this.isMoveValid(piece, targetX, targetY)) {
      this.board[piece.x][piece.y] = null;
      piece.x = targetX;
      piece.y = targetY;
      this.board[targetX][targetY] = piece;
    }
  }  

  isMoveValid(piece, targetX, targetY) {
    if (targetX < 0 || targetX >= 8 || targetY < 0 || targetY >= 8) {
      return false;
    }
  
    if (this.board[targetX][targetY] !== null) {
      return false;
    }
  
    if (piece.type === "pawn") {
      const direction = piece.color === "white" ? -1 : 1;
      const initialRow = piece.color === "white" ? 6 : 1;
  
      if (piece.x === targetX) {
        if (targetY === piece.y + direction) {
          return this.board[targetX][targetY] === null;
        } else if (
          piece.y === initialRow &&
          targetY === piece.y + 2 * direction
        ) {
          return (
            this.board[targetX][piece.y + direction] === null &&
            this.board[targetX][targetY] === null
          );
        }
      }
      return false;
    } else if (piece.type === "rook") {
      return targetX === piece.x || targetY === piece.y;
    }
    return true;
  }  
}

const chessBoard = new Board();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  chessBoard.drawBoard();
  chessBoard.drawPieces();
}

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const cellSize = canvas.width / 8;
  const clickedX = Math.floor(mouseX / cellSize);
  const clickedY = Math.floor(mouseY / cellSize);

  const clickedPiece = chessBoard.board[clickedX][clickedY];

  if (clickedPiece) {
    chessBoard.movePiece(clickedPiece, clickedX, clickedY);
  }
  draw();
});

draw();
