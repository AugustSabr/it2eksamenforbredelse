const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 300;
ctx.canvas.height = 300;

const gridSize = 3;
const cellSize = canvas.width / gridSize;

class TicTacToe {
  constructor() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.currentPlayer = 'X';
    this.gameOver = false;
  }

  drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    for (let i = 1; i < gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellContent = this.board[row][col];
        if (cellContent !== '') {
          ctx.font = 'bold 50px Arial';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(cellContent, col * cellSize + cellSize / 3, row * cellSize + cellSize / 1.5);
        }
      }
    }
  }

  checkWinner() {
    for (let i = 0; i < gridSize; i++) {
      if (
        this.board[i][0] !== '' &&
        this.board[i][0] === this.board[i][1] &&
        this.board[i][1] === this.board[i][2]
      ) {
        this.gameOver = true;
        return this.board[i][0];
      }

      if (
        this.board[0][i] !== '' &&
        this.board[0][i] === this.board[1][i] &&
        this.board[1][i] === this.board[2][i]
      ) {
        this.gameOver = true;
        return this.board[0][i];
      }
    }

    if (
      this.board[0][0] !== '' &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      this.gameOver = true;
      return this.board[0][0];
    }

    if (
      this.board[0][2] !== '' &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      this.gameOver = true;
      return this.board[0][2];
    }

    return null;
  }

  handleClick(x, y) {
    if (this.gameOver) return;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (this.board[row][col] === '') {
      this.board[row][col] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    const winner = this.checkWinner();
    if (winner !== null) {
      this.gameOver = true;
      alert(`Player ${winner} wins!`);
    }
  }
}

const game = new TicTacToe();
game.drawBoard();

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  game.handleClick(x, y);
  game.drawBoard();
});
