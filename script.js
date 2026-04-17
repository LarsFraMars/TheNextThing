const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElem = document.getElementById('score');
const highScoreElem = document.getElementById('highScore');
const increaseSpeed = document.getElementById('increaseSpeed');
const decreaseSpeed = document.getElementById('decreaseSpeed');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 10;
let score = 0;
let highScore = 0;
let snake = [{ x: 10, y: 10 }];
let velocity = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let gameInterval;
let isGameOver = false;

function draw() {
  ctx.fillStyle = '#05050d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffe81f';
  ctx.font = '20px monospace';
  ctx.fillText('STAR WARS SNAKE', 10, 24);

  ctx.fillStyle = '#ff2d2d';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = '#34ebff';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    if (index === 0) {
      ctx.strokeStyle = '#ffe81f';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
  });

  if (isGameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 12);
    ctx.font = '18px monospace';
    ctx.fillText('Try again by pressing Enter', canvas.width / 2, canvas.height / 2 + 22);
    ctx.textAlign = 'start';
  }
}

function update() {
  if (isGameOver) return;

  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return endGame();
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return endGame();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElem.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function spawnFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

  food = newFood;
}

function setSpeed(value) {
  speed = Math.max(3, Math.min(20, value));
  document.getElementById('speed').textContent = speed;
  resetInterval();
}

function resetInterval() {
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 1000 / speed);
}

function endGame() {
  isGameOver = true;
  if (score > highScore) {
    highScore = score;
    highScoreElem.textContent = highScore;
  }
  draw();
}

function restart() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 1, y: 0 };
  score = 0;
  scoreElem.textContent = score;
  isGameOver = false;
  spawnFood();
  resetInterval();
  draw();
}

window.addEventListener('keydown', event => {
  if (isGameOver && event.key === 'Enter') {
    return restart();
  }

  if (event.key === 'ArrowUp' && velocity.y !== 1) {
    velocity = { x: 0, y: -1 };
  } else if (event.key === 'ArrowDown' && velocity.y !== -1) {
    velocity = { x: 0, y: 1 };
  } else if (event.key === 'ArrowLeft' && velocity.x !== 1) {
    velocity = { x: -1, y: 0 };
  } else if (event.key === 'ArrowRight' && velocity.x !== -1) {
    velocity = { x: 1, y: 0 };
  }
});

increaseSpeed.addEventListener('click', () => setSpeed(speed + 1));
decreaseSpeed.addEventListener('click', () => setSpeed(speed - 1));

spawnFood();
resetInterval();
draw();
