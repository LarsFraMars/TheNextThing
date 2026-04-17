const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  parent: 'game-container',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
let snake;
let food;
let cursors;
let score = 0;
let scoreText;
let moveTimer = 0;
const tileSize = 20;
const boardWidth = config.width / tileSize;
const boardHeight = config.height / tileSize;
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let gameOver = false;

function preload() {
  this.load.image('star', 'https://i.imgur.com/q5vOfaK.png');
}

function create() {
  this.add.rectangle(config.width / 2, config.height / 2, config.width, config.height, 0x000000);
  createStarfield(this);

  snake = [];
  const startX = Math.floor(boardWidth / 2) * tileSize;
  const startY = Math.floor(boardHeight / 2) * tileSize;

  for (let i = 0; i < 5; i++) {
    snake.push(createSegment(this, startX - i * tileSize, startY, i === 0));
  }

  food = this.add.rectangle(0, 0, tileSize, tileSize, 0xffd700).setOrigin(0);
  spawnFood(this);

  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: { x: 8, y: 4 }
  }).setDepth(2);

  this.add.text(config.width - 240, 16, 'WASD or Arrow keys', {
    fontFamily: 'monospace',
    fontSize: '16px',
    color: '#bbbbbb'
  }).setDepth(2);

  cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    up2: Phaser.Input.Keyboard.KeyCodes.UP,
    down2: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left2: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right2: Phaser.Input.Keyboard.KeyCodes.RIGHT
  });

  this.input.keyboard.on('keydown', handleDirectionChange);
}

function update(time) {
  if (gameOver) {
    return;
  }

  if (time >= moveTimer) {
    direction = nextDirection;
    moveSnake(this);
    moveTimer = time + 120;
  }
}

function createStarfield(scene) {
  for (let i = 0; i < 120; i++) {
    const x = Phaser.Math.Between(0, config.width);
    const y = Phaser.Math.Between(0, config.height);
    const size = Phaser.Math.Between(1, 3);
    scene.add.rectangle(x, y, size, size, 0xffffff).setAlpha(Phaser.Math.FloatBetween(0.4, 1));
  }
}

function createSegment(scene, x, y, head = false) {
  const color = head ? 0x00b0ff : 0x2bff4c;
  const segment = scene.add.rectangle(x, y, tileSize, tileSize, color).setOrigin(0);
  if (head) {
    segment.setStrokeStyle(2, 0x00e0ff);
  }
  return segment;
}

function handleDirectionChange(event) {
  if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.W || event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) {
    if (direction !== 'DOWN') nextDirection = 'UP';
  } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.S || event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) {
    if (direction !== 'UP') nextDirection = 'DOWN';
  } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.A || event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) {
    if (direction !== 'RIGHT') nextDirection = 'LEFT';
  } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.D || event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
    if (direction !== 'LEFT') nextDirection = 'RIGHT';
  }
}

function moveSnake(scene) {
  const head = snake[0];
  const newX = Phaser.Math.Wrap(head.x + (direction === 'LEFT' ? -tileSize : direction === 'RIGHT' ? tileSize : 0), 0, config.width);
  const newY = Phaser.Math.Wrap(head.y + (direction === 'UP' ? -tileSize : direction === 'DOWN' ? tileSize : 0), 0, config.height);

  if (isCollision(newX, newY)) {
    endGame(scene);
    return;
  }

  const tail = snake.pop();
  tail.x = newX;
  tail.y = newY;
  snake.unshift(tail);

  snake.forEach((segment, index) => {
    segment.fillColor = index === 0 ? 0x00b0ff : 0x2bff4c;
    segment.setStrokeStyle(index === 0 ? 2 : 0, 0x00e0ff);
  });

  if (head.x === food.x && head.y === food.y) {
    eatFood(scene);
  }
}

function isCollision(x, y) {
  return snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
}

function spawnFood(scene) {
  const availableCells = [];

  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      const px = x * tileSize;
      const py = y * tileSize;
      if (!snake.some(segment => segment.x === px && segment.y === py)) {
        availableCells.push({ x: px, y: py });
      }
    }
  }

  const nextCell = Phaser.Utils.Array.GetRandom(availableCells);
  food.x = nextCell.x;
  food.y = nextCell.y;
  food.fillColor = 0xffd700;
  food.setStrokeStyle(2, 0xffffff);
}

function eatFood(scene) {
  const tail = createSegment(scene, snake[snake.length - 1].x, snake[snake.length - 1].y);
  snake.push(tail);
  score += 10;
  scoreText.setText('Score: ' + score);
  spawnFood(scene);
}

function endGame(scene) {
  gameOver = true;
  scene.add.text(config.width / 2, config.height / 2 - 20, 'GAME OVER', {
    fontFamily: 'monospace',
    fontSize: '48px',
    color: '#ff0000',
    stroke: '#ffffff',
    strokeThickness: 4
  }).setOrigin(0.5);

  scene.add.text(config.width / 2, config.height / 2 + 40, 'Refresh to restart', {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: '#ffffff'
  }).setOrigin(0.5);
}
