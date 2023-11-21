const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 400;
ctx.canvas.height = 400;

const gridSize = 4;
const cardSize = canvas.width / gridSize;

class MemoryGame {
  constructor() {
    this.cards = [];
    this.generateCards();
    this.shuffleCards();
    this.selectedCards = [];
    this.gameOver = false;
  }

  generateCards() {
    let cardId = 1;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        this.cards.push({
          id: cardId,
          content: String.fromCharCode(65 + Math.floor(cardId / 2)), // Generer par med bokstaver (A, B, C, ...)
          flipped: false,
          matched: false
        });
        cardId++;
      }
    }
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCards() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      ctx.fillStyle = card.flipped ? '#fff' : '#000'; // Endre fargen på bakgrunnen av kortet basert på om det er snudd eller ikke

      if (card.matched) {
        ctx.fillStyle = 'green'; // Endre fargen til matchede kort
      }

      ctx.fillRect(col * cardSize, row * cardSize, cardSize, cardSize);
      ctx.strokeRect(col * cardSize, row * cardSize, cardSize, cardSize);

      if (card.flipped || card.matched) {
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(card.content, col * cardSize + cardSize / 3, row * cardSize + cardSize / 1.5);
      }
    }
  }

  handleClick(x, y) {
    if (this.gameOver) return;

    const col = Math.floor(x / cardSize);
    const row = Math.floor(y / cardSize);
    const index = row * gridSize + col;

    const selectedCard = this.cards[index];

    if (!selectedCard || selectedCard.flipped || selectedCard.matched) return;

    if (this.selectedCards.length === 2) {
      this.selectedCards.forEach(card => {
        if (!card.matched) {
          card.flipped = false;
        }
      });
      this.selectedCards = [];
    }

    selectedCard.flipped = true;
    this.selectedCards.push(selectedCard);

    if (this.selectedCards.length === 2) {
      setTimeout(() => {
        this.checkMatch();
        this.selectedCards = [];
        this.drawCards();
      }, 1000);
    }

    this.drawCards();

    if (this.cards.every(card => card.matched)) {
      this.gameOver = true;
      alert('Congratulations! You won!');
    }
  }

  checkMatch() {
    if (this.selectedCards[0].content === this.selectedCards[1].content) {
      this.selectedCards[0].matched = true;
      this.selectedCards[1].matched = true;
    } else {
      this.selectedCards[0].flipped = false;
      this.selectedCards[1].flipped = false;
    }
  }
  
}

const game = new MemoryGame();
game.drawCards();

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  game.handleClick(x, y);
});
