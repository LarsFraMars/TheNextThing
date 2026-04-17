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
let planets = [];

// Initialize starfield with planets
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
  
  // Add planets
  planets = [
    { x: 100, y: 150, radius: 30, color: '#ff6b35', vx: 0.05, vy: 0.03 },
    { x: 500, y: 400, radius: 45, color: '#f7931e', vx: 0.02, vy: 0.08 },
    { x: 450, y: 100, radius: 25, color: '#004e89', vx: 0.08, vy: 0.02 }
  ];
}

// Audio initialization
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Play synth music loop with multiple instruments - Fun and energetic!
function playSynthMusic() {
  initAudio();
  const now = audioContext.currentTime;
  
  // Energetic bass line with bouncy rhythm
  const bass = audioContext.createOscillator();
  const bassGain = audioContext.createGain();
  bass.type = 'square';
  bass.connect(bassGain);
  bassGain.connect(audioContext.destination);
  
  // Fun bass pattern - bouncy!
  const bassNotes = [65.41, 82.41, 65.41, 110.00, 82.41, 65.41, 146.83, 110.00];
  const noteDuration = 0.2;
  
  for (let i = 0; i < 12; i++) {
    bass.frequency.setValueAtTime(bassNotes[i % 8], now + i * noteDuration);
    bassGain.gain.setValueAtTime(0.04, now + i * noteDuration);
    bassGain.gain.setValueAtTime(0, now + i * noteDuration + noteDuration * 0.7);
  }
  
  bass.start(now);
  bass.stop(now + noteDuration * 12);
  
  // Fun melody line - playful!
  const melody = audioContext.createOscillator();
  const melodyGain = audioContext.createGain();
  melody.type = 'sawtooth';
  melody.connect(melodyGain);
  melodyGain.connect(audioContext.destination);
  
  // Playful ascending melody
  const melodyNotes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25];
  
  for (let i = 0; i < 12; i++) {
    melody.frequency.setValueAtTime(melodyNotes[i], now + i * noteDuration);
    melodyGain.gain.setValueAtTime(0.05, now + i * noteDuration);
    melodyGain.gain.setValueAtTime(0, now + i * noteDuration + noteDuration * 0.7);
  }
  
  melody.start(now);
  melody.stop(now + noteDuration * 12);
  
  // Harmony pad - adds fullness
  const pad = audioContext.createOscillator();
  const padGain = audioContext.createGain();
  pad.type = 'sine';
  pad.connect(padGain);
  padGain.connect(audioContext.destination);
  
  pad.frequency.setValueAtTime(196.00, now);
  padGain.gain.setValueAtTime(0.03, now);
  padGain.gain.setValueAtTime(0.03, now + noteDuration * 12 - 0.1);
  padGain.gain.setValueAtTime(0, now + noteDuration * 12);
  
  pad.start(now);
  pad.stop(now + noteDuration * 12);
  
  // Random fun blips for extra pizzazz
  for (let b = 0; b < 3; b++) {
    setTimeout(() => {
      const blip = audioContext.createOscillator();
      const blipGain = audioContext.createGain();
      blip.type = 'triangle';
      blip.connect(blipGain);
      blipGain.connect(audioContext.destination);
      
      const blipFreq = 1200 + Math.random() * 800;
      blip.frequency.setValueAtTime(blipFreq, audioContext.currentTime);
      blipGain.gain.setValueAtTime(0.02, audioContext.currentTime);
      blipGain.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
      blip.start(audioContext.currentTime);
      blip.stop(audioContext.currentTime + 0.1);
    }, Math.random() * 1500);
  }
  
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

// Explosion effect - MASSIVE and visual!
function createExplosion(x, y, intensity = 1) {
  const particleCount = Math.floor(25 * intensity);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = (Math.random() * 4 + 3) * intensity;
    
    explosionParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color: ['#ffff00', '#ff6b00', '#ff0000', '#ffaa00', '#ffffff'][Math.floor(Math.random() * 5)],
      size: Math.random() * 6 + 3
    });
  }
  
  // Shockwave rings
  for (let ring = 0; ring < 2; ring++) {
    explosionParticles.push({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      life: 0.8,
      maxLife: 0.8,
      isRing: true,
      size: 5 + ring * 10,
      expandSpeed: (15 + ring * 8) * intensity,
      color: '#ffff00'
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
  
  // Draw planets
  planets.forEach(planet => {
    planet.x += planet.vx;
    planet.y += planet.vy;
    
    // Wrap around edges
    if (planet.x < -50) planet.x = canvas.width + 50;
    if (planet.x > canvas.width + 50) planet.x = -50;
    if (planet.y < -50) planet.y = canvas.height + 50;
    if (planet.y > canvas.height + 50) planet.y = -50;
    
    // Draw planet
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet ring/glow
    ctx.strokeStyle = planet.color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
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

// Draw explosions - MASSIVE VISUALS!
function drawExplosions() {
  explosionParticles = explosionParticles.filter(p => p.life > 0);
  explosionParticles.forEach(p => {
    if (p.isRing) {
      // Draw expanding ring
      p.size += p.expandSpeed;
      p.life -= 0.08;
      
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.lineWidth = Math.max(1, 3 * p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      // Regular particles
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.life -= 0.06;
      
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.8;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
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

  // Snake - Yellow body with red head, drawn as actual snake!
  snake.forEach((segment, index) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    
    if (index === 0) {
      // Snake head - red with eyes!
      ctx.fillStyle = '#ff2d2d';
      ctx.beginPath();
      ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = '#ffffff';
      const eyeSize = 2;
      const eyeY = y + gridSize/3;
      
      // Determine head direction for eye placement
      let eyeX1 = x + gridSize/3;
      let eyeX2 = x + 2*gridSize/3;
      if (velocity.x < 0) { eyeX1 = x + gridSize/4; eyeX2 = x + gridSize/4 + 2; }
      else if (velocity.x > 0) { eyeX1 = x + 3*gridSize/4; eyeX2 = x + 3*gridSize/4 + 2; }
      else if (velocity.y < 0) { eyeX1 = x + gridSize/3; eyeX2 = x + 2*gridSize/3; }
      
      ctx.fillRect(eyeX1 - eyeSize, eyeY - eyeSize, eyeSize*2, eyeSize*2);
      ctx.fillRect(eyeX2 - eyeSize, eyeY - eyeSize, eyeSize*2, eyeSize*2);
      
      // Tongue
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + gridSize/2, y + 2*gridSize/3);
      ctx.lineTo(x + gridSize/2 + 5, y + gridSize - 2);
      ctx.stroke();
    } else {
      // Body segments - yellow, slightly transparent based on distance
      const opacity = 1 - (index / snake.length) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
      ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
      
      // Segment outlines for definition
      ctx.strokeStyle = `rgba(200, 200, 0, ${opacity * 0.6})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    }
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
    
    // MASSIVE explosion for DeathStar!
    createExplosion((deathStar.x + 0.5) * gridSize, (deathStar.y + 0.5) * gridSize, 2);
    
    // Cool explosion sound
    playSound(880, 0.3);
    playSound(440, 0.2);
    
    spawnDeathStar();
    foodEaten = true;
  }

  if (wrappedHead.x === superMario.x && wrappedHead.y === superMario.y && !superMario.blinking) {
    score += 10;
    scoreElem.textContent = score;
    
    // MEGA explosion for SuperMario!
    createExplosion((superMario.x + 0.5) * gridSize, (superMario.y + 0.5) * gridSize, 3);
    
    // Fun victory sound
    playSound(1320, 0.1);
    playSound(1760, 0.1);
    playSound(1320, 0.15);
    
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
