const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElem = document.getElementById('score');
const highScoreElem = document.getElementById('highScore');
const increaseSpeed = document.getElementById('increaseSpeed');
const decreaseSpeed = document.getElementById('decreaseSpeed');

const gridSize = 30;
const tileCount = canvas.width / gridSize;
let speed = 5;
let score = 0;
let highScore = 0;
let snake = [{ x: 10, y: 10 }];
let velocity = { x: 1, y: 0 };
let nextVelocity = { x: 1, y: 0 };
let deathStar = { x: 15, y: 15 };
let superMario = { x: 5, y: 5, vx: 1, vy: 0, blinking: false, blinkTimer: 0 };
let gameInterval;
let isGameOver = false;
let starfield = [];
let audioContext = null;
let explosionParticles = [];
let rAFId = null;

// Initialize starfield
function initStarfield() {
  starfield = [];
  for (let i = 0; i < 150; i++) {
    starfield.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 0.5 + 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.4
    });
  }
}

// Audio initialization
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Play synth music loop with multiple instruments
function playSynthMusic() {
  initAudio();
  const now = audioContext.currentTime;
  
  // Bass line
  const bass = audioContext.createOscillator();
  const bassGain = audioContext.createGain();
  bass.type = 'square';
  bass.connect(bassGain);
  bassGain.connect(audioContext.destination);
  
  const bassNotes = [65.41, 73.42, 82.41, 73.42]; // C2, D2, E2, D2
  const noteDuration = 0.3;
  
  for (let i = 0; i < 8; i++) {
    bass.frequency.setValueAtTime(bassNotes[i % 4], now + i * noteDuration);
    bassGain.gain.setValueAtTime(0.03, now + i * noteDuration);
    bassGain.gain.setValueAtTime(0, now + i * noteDuration + noteDuration * 0.8);
  }
  
  bass.start(now);
  bass.stop(now + noteDuration * 8);
  
  // Melody line
  const melody = audioContext.createOscillator();
  const melodyGain = audioContext.createGain();
  melody.type = 'triangle';
  melody.connect(melodyGain);
  melodyGain.connect(audioContext.destination);
  
  const melodyNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66]; // C4, D4, E4, F4, G4, F4, E4, D4
  
  for (let i = 0; i < 8; i++) {
    melody.frequency.setValueAtTime(melodyNotes[i], now + i * noteDuration);
    melodyGain.gain.setValueAtTime(0.04, now + i * noteDuration);
    melodyGain.gain.setValueAtTime(0, now + i * noteDuration + noteDuration * 0.8);
  }
  
  melody.start(now);
  melody.stop(now + noteDuration * 8);
  
  // Harmony/pad
  const pad = audioContext.createOscillator();
  const padGain = audioContext.createGain();
  pad.type = 'sine';
  pad.connect(padGain);
  padGain.connect(audioContext.destination);
  
  pad.frequency.setValueAtTime(130.81, now);
  padGain.gain.setValueAtTime(0.02, now);
  padGain.gain.setValueAtTime(0.02, now + noteDuration * 8 - 0.1);
  padGain.gain.setValueAtTime(0, now + noteDuration * 8);
  
  pad.start(now);
  pad.stop(now + noteDuration * 8);
  
  setTimeout(() => playSynthMusic(), 2400);
}

// Play sound effect
function playSound(frequency = 440, duration = 0.1) {
  initAudio();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + duration);
}

// Explosion effect
function createExplosion(x, y) {
  for (let i = 0; i < 12; i++) {
    explosionParticles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      color: ['#ff6b6b', '#ffd93d', '#ff2d2d', '#ffaa00'][Math.floor(Math.random() * 4)]
    });
  }
}

// Draw starfield
function drawStarfield() {
  starfield.forEach(star => {
    star.x -= star.vx;
    if (star.x < 0) star.x = canvas.width;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

// Draw portals at edges
function drawPortals() {
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  
  // Left portal
  ctx.strokeRect(0, 0, 2, canvas.height);
  
  // Right portal
  ctx.strokeRect(canvas.width - 2, 0, 2, canvas.height);
  
  // Top portal
  ctx.strokeRect(0, 0, canvas.width, 2);
  
  // Bottom portal
  ctx.strokeRect(0, canvas.height - 2, canvas.width, 2);
  
  ctx.globalAlpha = 1;
}

// Draw explosions
function drawExplosions() {
  explosionParticles = explosionParticles.filter(p => p.life > 0);
  explosionParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // gravity
    p.life -= 0.05;
    
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x, p.y, 4, 4);
    ctx.globalAlpha = 1;
  });
}

// Draw SuperMario sprite - highly detailed
function drawSuperMario(x, y, blinking, blinkTimer) {
  const px = x * gridSize;
  const py = y * gridSize;
  
  if (blinking && (blinkTimer % 20) >= 10) return;
  
  const scale = gridSize / 30; // Scale for proportions
  
  // Red shirt/body
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(px + 6, py + 12, 18, 12);
  
  // Red overalls straps
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(px + 8, py + 12, 2, 10);
  ctx.fillRect(px + 20, py + 12, 2, 10);
  
  // Blue overalls pants
  ctx.fillStyle = '#0066ff';
  ctx.fillRect(px + 6, py + 22, 18, 6);
  
  // Yellow buttons on overalls
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(px + 11, py + 15, 2, 2);
  ctx.fillRect(px + 17, py + 15, 2, 2);
  
  // Shoes
  ctx.fillStyle = '#3d2817';
  ctx.fillRect(px + 8, py + 28, 6, 2);
  ctx.fillRect(px + 16, py + 28, 6, 2);
  
  // Skin (head and hands)
  ctx.fillStyle = '#ffdbac';
  
  // Head
  ctx.beginPath();
  ctx.arc(px + 15, py + 8, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Neck
  ctx.fillRect(px + 13, py + 12, 4, 2);
  
  // Left hand
  ctx.fillRect(px + 4, py + 14, 3, 3);
  
  // Right hand
  ctx.fillRect(px + 23, py + 14, 3, 3);
  
  // Eyes with expression
  ctx.fillStyle = '#000000';
  ctx.fillRect(px + 12, py + 6, 1, 2);
  ctx.fillRect(px + 17, py + 6, 1, 2);
  
  // Eyebrows
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(px + 11, py + 5);
  ctx.lineTo(px + 13, py + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px + 17, py + 5);
  ctx.lineTo(px + 19, py + 5);
  ctx.stroke();
  
  // Mouth
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(px + 15, py + 9, 1, 0, Math.PI);
  ctx.fill();
  
  // Red cap/hat
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(px + 10, py + 3);
  ctx.lineTo(px + 20, py + 3);
  ctx.lineTo(px + 18, py + 1);
  ctx.lineTo(px + 12, py + 1);
  ctx.fill();
  
  // Cap bill/visor
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(px + 10, py + 3, 10, 1);
}

function draw() {
  // Background
  ctx.fillStyle = '#05050d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Starfield
  drawStarfield();
  
  // Title
  ctx.fillStyle = '#ffe81f';
  ctx.font = '20px monospace';
  ctx.fillText('STAR WARS SNAKE', 10, 24);

  // DeathStar
  const deathStarX = deathStar.x * gridSize + gridSize / 2;
  const deathStarY = deathStar.y * gridSize + gridSize / 2;
  ctx.fillStyle = '#808080';
  ctx.beginPath();
  ctx.arc(deathStarX, deathStarY, gridSize / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a0a0a0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // SuperMario
  drawSuperMario(superMario.x, superMario.y, superMario.blinking, superMario.blinkTimer);

  // Snake - Yellow body with red head
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = '#ff2d2d';
    } else {
      ctx.fillStyle = '#ffff00';
    }
    ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
  });

  // Explosions
  drawExplosions();
  
  // Portals
  drawPortals();

  // Game over
  if (isGameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 12);
    ctx.font = '18px monospace';
    ctx.fillText('Press Enter to restart', canvas.width / 2, canvas.height / 2 + 22);
    ctx.textAlign = 'start';
  }
}

function updateSuperMario() {
  const randomChance = Math.random();
  
  if (randomChance < 0.04) {
    const directions = [{vx: 1, vy: 0}, {vx: -1, vy: 0}, {vx: 0, vy: 1}, {vx: 0, vy: -1}];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    superMario.vx = dir.vx;
    superMario.vy = dir.vy;
  } else if (randomChance < 0.08) {
    superMario.vx = 0;
    superMario.vy = 0;
  }
  
  let newX = superMario.x + superMario.vx;
  let newY = superMario.y + superMario.vy;
  
  if (newX < 0) newX = tileCount - 1;
  if (newX >= tileCount) newX = 0;
  if (newY < 0) newY = tileCount - 1;
  if (newY >= tileCount) newY = 0;
  
  superMario.x = newX;
  superMario.y = newY;
  
  if (superMario.blinking) {
    superMario.blinkTimer--;
    if (superMario.blinkTimer <= 0) {
      superMario.blinking = false;
      spawnSuperMario();
    }
  }
}

function spawnSuperMario() {
  let newMario;
  do {
    newMario = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(segment => segment.x === newMario.x && segment.y === newMario.y));
  
  superMario.x = newMario.x;
  superMario.y = newMario.y;
}

function spawnDeathStar() {
  let newDeathStar;
  do {
    newDeathStar = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(segment => segment.x === newDeathStar.x && segment.y === newDeathStar.y) ||
           (superMario.x === newDeathStar.x && superMario.y === newDeathStar.y));

  deathStar = newDeathStar;
}

function update() {
  if (isGameOver) return;

  velocity = nextVelocity;
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  let wrappedHead = { x: head.x, y: head.y };
  if (wrappedHead.x < 0) wrappedHead.x = tileCount - 1;
  if (wrappedHead.x >= tileCount) wrappedHead.x = 0;
  if (wrappedHead.y < 0) wrappedHead.y = tileCount - 1;
  if (wrappedHead.y >= tileCount) wrappedHead.y = 0;

  if (snake.some(segment => segment.x === wrappedHead.x && segment.y === wrappedHead.y)) {
    return endGame();
  }

  snake.unshift(wrappedHead);
  let foodEaten = false;

  if (wrappedHead.x === deathStar.x && wrappedHead.y === deathStar.y) {
    score += 5;
    scoreElem.textContent = score;
    playSound(880, 0.1);
    createExplosion((deathStar.x + 0.5) * gridSize, (deathStar.y + 0.5) * gridSize);
    spawnDeathStar();
    foodEaten = true;
  }

  if (wrappedHead.x === superMario.x && wrappedHead.y === superMario.y && !superMario.blinking) {
    score += 10;
    scoreElem.textContent = score;
    playSound(1320, 0.15);
    createExplosion((superMario.x + 0.5) * gridSize, (superMario.y + 0.5) * gridSize);
    superMario.blinking = true;
    superMario.blinkTimer = 80;
    foodEaten = true;
  }

  if (!foodEaten) {
    snake.pop();
  }

  updateSuperMario();
}

function setSpeed(value) {
  speed = Math.max(1, Math.min(15, value));
  document.getElementById('speed').textContent = speed;
  resetInterval();
}

function resetInterval() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    update();
    draw();
  }, 1000 / (speed * 2));
}

function endGame() {
  isGameOver = true;
  if (score > highScore) {
    highScore = score;
    highScoreElem.textContent = highScore;
  }
}

function restart() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 1, y: 0 };
  nextVelocity = { x: 1, y: 0 };
  score = 0;
  scoreElem.textContent = score;
  isGameOver = false;
  superMario.blinking = false;
  spawnDeathStar();
  spawnSuperMario();
  resetInterval();
  draw();
}

window.addEventListener('keydown', event => {
  if (isGameOver && event.key === 'Enter') {
    return restart();
  }

  if (event.key === 'ArrowUp' && velocity.y !== 1) {
    nextVelocity = { x: 0, y: -1 };
  } else if (event.key === 'ArrowDown' && velocity.y !== -1) {
    nextVelocity = { x: 0, y: 1 };
  } else if (event.key === 'ArrowLeft' && velocity.x !== 1) {
    nextVelocity = { x: -1, y: 0 };
  } else if (event.key === 'ArrowRight' && velocity.x !== -1) {
    nextVelocity = { x: 1, y: 0 };
  } else if (event.key === 'w' || event.key === 'W') {
    nextVelocity = { x: 0, y: -1 };
  } else if (event.key === 's' || event.key === 'S') {
    nextVelocity = { x: 0, y: 1 };
  } else if (event.key === 'a' || event.key === 'A') {
    nextVelocity = { x: -1, y: 0 };
  } else if (event.key === 'd' || event.key === 'D') {
    nextVelocity = { x: 1, y: 0 };
  }
});

increaseSpeed.addEventListener('click', () => setSpeed(speed + 1));
decreaseSpeed.addEventListener('click', () => setSpeed(speed - 1));

function gameLoop() {
  draw();
  rAFId = requestAnimationFrame(gameLoop);
}

initStarfield();
initAudio();
playSynthMusic();
spawnDeathStar();
spawnSuperMario();
resetInterval();
gameLoop();
