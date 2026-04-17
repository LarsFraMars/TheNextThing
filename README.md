# 🐍 Star Wars Snake - Intergalactic Adventure

A fast-paced, visually stunning browser-based Snake game set in a Star Wars universe! Navigate your way through space, eat the Death Stars, collect power-ups, and compete for the high score.

---

## ✨ Features

🎮 **Gameplay**
- Classic snake mechanics with a sci-fi twist
- Smooth, responsive controls (keyboard + buttons)
- Adjustable game speed (1-15 levels)
- High score tracking
- Portal wrapping at screen edges (travel through hyperspace!)

🎨 **Visuals**
- **Realistic animated snake** - Red head with expressive white eyes and tongue
- **Detailed SuperMario character** - With overalls, hat, and personality
- **Animated starfield** - 150+ moving stars creating depth
- **3 moving planets** - Orange, rust-red, and blue planets drift across the background
- **Massive explosion effects** - Particles, shockwave rings, and glowing particles
- **Death Star design** - Grey circular enemies with orbital glow
- **Star Wars themed UI** - Yellow glowing text, dark space background

🔊 **Audio**
- **Energetic synth soundtrack** - Fun, bouncy music that loops continuously
- Sawtooth and square wave instruments for that 80s retro feel
- **Dynamic sound effects** - Satisfying beeps when eating food
- Victory jingles on big scores

🎯 **Collectibles**
- **Death Star** (⭐) - 5 points each, standard food
- **Super Mario** (🔴) - 10 points, moves erratically, blinking teleport effect

---

## 🎮 How to Play

### Start the Game
Simply open `index.html` in any modern web browser!

```
file:///c:/Users/14623/OneDrive%20-%20Hatteland/Visual%20Code/Snake/index.html
```

### Controls
| Action | Keys |
|--------|------|
| Move Up | `↑` or `W` |
| Move Down | `↓` or `S` |
| Move Left | `←` or `A` |
| Move Right | `→` or `D` |
| Restart (after game over) | `Enter` |
| Speed Up | `+` Button |
| Speed Down | `-` Button |

### Objectives
1. 🟡 **Eat Death Stars** (gray circles) = **5 points** each
2. 🟥 **Eat Super Mario** (red pixel character) = **10 points** each
3. 🐍 **Grow longer** - Each food eaten adds a segment to your snake
4. 📈 **Beat your high score** - Your best score is saved
5. ⚡ **Use hyperspace portals** - Wrap around edges to escape danger

### Tips
- SuperMario moves erratically - predict its path!
- Use the portal wrapping at edges strategically
- Watch your snake's length - don't trap yourself
- Adjust speed to find your comfort zone
- Listen for the energetic music and victory sounds

---

## 🚀 Quick Start

### Option 1: Direct Browser Play (Easiest)
```
1. Open this folder on your computer
2. Double-click index.html
3. Play! 🎮
```

### Option 2: Local Web Server
```bash
# Install Python (or use Node.js with http-server)
python -m http.server 8000

# Then visit: http://localhost:8000
```

---

## 📦 Project Structure

```
Snake/
├── index.html          # Main game container & UI
├── style.css           # Star Wars styled visuals
├── script.js           # Game logic & rendering (600+ lines)
└── README.md          # This file
```

---

## 🛠 Technology Stack

- **Pure HTML5 Canvas** - No frameworks needed
- **Vanilla JavaScript (ES6)** - Modern JS without dependencies
- **Web Audio API** - Dynamic synth music generation
- **CSS3** - Styling and animations

---

## 🎨 Game Design Details

### Snake Rendering
- Head: Red circle with white eyes and animated tongue
- Body: Yellow rectangles with decreasing opacity for depth
- Directional eyes that follow movement direction

### Particles & Effects
- **Explosion rings** - Expanding yellow circles on food collection
- **Particle spray** - 25+ particles per Death Star, 50+ for Mario
- **Gravity simulation** - Particles fall naturally
- **Color variety** - Yellow, orange, red, and white explosions

### Audio Design
- **Bass**: Square wave with bouncy rhythm
- **Melody**: Sawtooth wave ascending progression
- **Harmony**: Sine wave pad for fullness
- **Blips**: Random triangle waves for personality

---

## 🎮 Game Settings

| Setting | Value |
|---------|-------|
| Canvas Size | 600×600 pixels |
| Grid Size | 30×30 pixels (20×20 grid) |
| Default Speed | 5 |
| Speed Range | 1-15 |
| Max Speed | ~30 updates/second |
| Snake Start Position | (10, 10) |
| Starting Length | 1 segment |
| Portal Wrap | Edges (all 4 sides) |

---

## 🌟 Version History

**v2.0** - Enhanced Edition
- ✅ Realistic snake with eyes and tongue
- ✅ Energetic, fun synth music
- ✅ Massive explosion effects with rings
- ✅ 3 animated planets in background
- ✅ Improved visuals and juice

**v1.0** - Initial Release
- Basic snake gameplay
- Death Star and Super Mario collectibles
- Simple explosions
- Basic synth music

---

## 🔧 Configuration (In Code)

Want to customize? Edit `script.js`:

```javascript
const gridSize = 30;              // Tile size in pixels
let speed = 5;                    // Starting speed (1-15)
const tileCount = canvas.width / gridSize;  // Grid dimensions
```

---

## 🎓 Learning Value

This project demonstrates:
- Game loop implementation with `requestAnimationFrame`
- Canvas 2D drawing techniques
- Collision detection algorithms
- Web Audio API synthesis
- Game state management
- Input handling (keyboard)
- Particle effects and physics

---

## 📝 License

Free to play, modify, and share!

---

## 🎯 Future Enhancements

Possible additions:
- [ ] Difficulty levels
- [ ] Power-ups (speed boost, shield, etc.)
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Different themes/skins
- [ ] Sound toggle option
- [ ] Pause functionality
- [ ] Enemy obstacles

---

## 🙌 Have Fun!

Enjoy your intergalactic snake adventure! May the Force be with your slithering serpent! 🌌

---

**Repository:** https://github.com/LarsFraMars/TheNextThing

Made with ❤️ in JavaScript | Play in any modern browser
