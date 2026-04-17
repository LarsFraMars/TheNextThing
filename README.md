# 🐍 Star Wars Snake - Intergalactic Adventure

<div align="center">

![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Made with](https://img.shields.io/badge/made%20with-❤️%20JavaScript-red?style=for-the-badge)

**A visually stunning, fast-paced browser-based Snake game with Star Wars aesthetics, realistic physics, and dynamic audio.**

[🎮 Play Now](#-quick-start) • [✨ Features](#-features) • [🎯 How to Play](#-how-to-play) • [📖 Documentation](#-documentation)

</div>

---

## 🌌 Overview

Journey through the cosmos as a sentient space serpent! Navigate treacherous asteroid fields, consume Death Stars for power, hunt the elusive Super Mario, and achieve the highest score in this retro-futuristic arcade experience.

**Built entirely with HTML5 Canvas and Web Audio API** – no dependencies, pure vanilla JavaScript, plays in any modern browser.

---

## ✨ Features

### 🎮 Core Gameplay
- **Classic Snake Mechanics** - Timeless gameplay reimagined in space
- **Portal System** - Wrap around screen edges for strategic escapes
- **Adaptive Difficulty** - Adjustable speed (1-15 levels)
- **High Score Tracking** - Persistent scoring across sessions
- **Responsive Controls** - Keyboard, arrow keys, and button controls

### 🎨 Visual Excellence
- **Realistic Animated Snake**
  - Red circular head with expressive white eyes and pupils
  - Detailed forked tongue that follows movement direction
  - Yellow body with soft rounded edges and organic curves
  - Intricate scale details across each body segment
  - Gradient transparency for depth perception

- **Stunning Backgrounds**
  - 150+ parallax-scrolling animated stars
  - 3 orbital planets with atmospheric glows (orange, rust-red, deep blue)
  - Dynamic starfield creating immersive 3D depth
  - Clean dark space aesthetic with retro sci-fi vibes

- **Dynamic Collectibles**
  - **Death Stars** - Grey spheres with orbital glow (5 points)
  - **Super Mario** - Pixel-perfect character sprite (10 points)

- **Explosive Particle Effects**
  - Massive expanding shockwave rings
  - 25+ particles per Death Star (intensity × 2)
  - 50+ particles per Super Mario (intensity × 3)
  - Realistic physics simulation with gravity
  - Color-varied explosions (yellow, orange, red, white)
  - Glowing particles with shadow effects

### 🔊 Audio Design
- **Energetic Synth Soundtrack**
  - Bouncy bass line with rhythmic progression
  - Ascending sawtooth melody for visual excitement
  - Harmonic sine wave pad for fullness
  - Random triangle wave "pizzazz" blips
  - ~2.4 second loop that continuously regenerates

- **Dynamic Sound Effects**
  - Satisfying collision sounds
  - Victory jingles on high scores
  - Layered audio feedback for all interactions

### 🐍 Advanced Snake Rendering
- **Realistic Body Structure**
  - Rounded quadratic curves on all segments
  - Scale pattern details (9-point circular scales per segment)
  - Opacity gradient from head to tail for depth
  - Smooth outline strokes for definition
  - Detailed head with facial patterns

- **Aggressive Growth System**
  - **+4 segments** for each Death Star consumed
  - **+6 segments** for each Super Mario collected
  - Visual feedback as snake grows exponentially
  - Tail-to-head fading effect emphasizes new growth

---

## 🎮 How to Play

### 🚀 Quick Start

**Option 1: Direct Browser Play (Recommended)**
```
1. Download or clone this repository
2. Open index.html in your web browser
3. Press any key to begin
4. Start playing! 🎮
```

**Option 2: Local Web Server**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit: http://localhost:8000
```

### 🕹 Controls

| Action | Keys |
|--------|------|
| **Move Up** | `↑` Arrow or `W` |
| **Move Down** | `↓` Arrow or `S` |
| **Move Left** | `←` Arrow or `A` |
| **Move Right** | `→` Arrow or `D` |
| **Restart** | `Enter` (after game over) |
| **Speed Up** | `+` Button |
| **Speed Down** | `-` Button |

### 🎯 Gameplay Objectives

1. **🟡 Collect Death Stars**
   - Small grey spheres scattered throughout the arena
   - **+5 points** per star
   - **+4 body segments** per star
   - Causes massive explosive shockwaves

2. **🔴 Hunt Super Mario**
   - Erratic red character that teleports around the map
   - **+10 points** per capture
   - **+6 body segments** per capture
   - More challenging to predict and catch
   - Blinking teleport effect when consumed

3. **📈 Maximize Your Score**
   - Beat your previous high score
   - Compete for the longest snake
   - Strategic feeding for optimal growth

4. **⚡ Survive and Thrive**
   - Avoid hitting your own body
   - Use portal wrapping strategically
   - Don't get trapped by your own length

### 💡 Pro Tips

- **Master Portal Wrapping** - Use screen edges as escape routes
- **Predict Mario's Path** - Study its erratic movement patterns
- **Manage Growth** - Balance length with maneuverability
- **Speed Tuning** - Find your optimal speed level (5-8 recommended)
- **Resource Gathering** - Collect both types for maximum points
- **Patience Pays** - Wait for optimal food positions

---

## 🎨 Technical Architecture

### Project Structure
```
Snake/
├── 📄 index.html              # Game container & UI elements
├── 🎨 style.css               # Star Wars-themed styling
├── 🎮 script.js               # Core game logic (800+ lines)
└── 📖 README.md              # This documentation
```

### Technology Stack
| Component | Technology |
|-----------|-----------|
| **Rendering** | HTML5 Canvas 2D Context |
| **Language** | Vanilla JavaScript (ES6+) |
| **Audio** | Web Audio API (Synth generation) |
| **Styling** | CSS3 with custom properties |
| **Architecture** | Game loop + update/render cycle |
| **Performance** | RequestAnimationFrame (60 FPS) |

### Game Engine Details

**Update Loop**
- 60 FPS rendering with `requestAnimationFrame`
- Configurable game updates (1-15 per second based on speed)
- Separate update and render phases

**Collision Detection**
- Grid-based system with 30×30 pixel tiles
- Wrapping boundary detection for portals
- Self-collision checking for snake segments

**Audio System**
- Dynamic oscillator synthesis (square, sawtooth, sine, triangle)
- Frequency modulation for melody generation
- Gain envelope controls for audio shaping

**Particle System**
- Ring-based explosions with expanding boundaries
- Velocity and gravity physics simulation
- Opacity fade-out for smooth particle death

---

## ⚙️ Configuration

### Game Settings
All settings are defined in `script.js`:

```javascript
const gridSize = 30;              // Pixel size of each grid tile
const tileCount = 20;             // 20×20 game grid
let speed = 5;                    // Starting game speed (1-15)
const canvas.width = 600;         // Game arena width
const canvas.height = 600;        // Game arena height
```

### Customization

**Change Grid Size:**
```javascript
const gridSize = 40;  // Larger tiles = fewer grid squares
```

**Adjust Starting Speed:**
```javascript
let speed = 7;  // 1-15 (higher = faster)
```

**Modify Snake Growth:**
Edit these lines in the `update()` function:
```javascript
// Death Star growth
for (let i = 0; i < 4; i++) { ... }  // Change 4 to desired amount

// Mario growth
for (let i = 0; i < 6; i++) { ... }  // Change 6 to desired amount
```

---

## 🎯 Game Design Details

### Visual Language
- **Color Palette**: Deep space black (#05050d) with bright neon accents
- **Typography**: Monospace fonts for retro authenticity
- **Effects**: Glow shadows, particle systems, transparency layering

### Audio Design Philosophy
- **Bass**: Square wave provides rhythmic foundation
- **Melody**: Sawtooth wave creates energetic, playful character
- **Harmony**: Sine wave pad adds emotional depth
- **Personality**: Random blips inject unexpected delight

### Particle Physics
```javascript
// Gravity simulation
particle.vy += 0.2;

// Velocity damping
particle.x += particle.vx;
particle.y += particle.vy;

// Lifespan decay
particle.life -= 0.06;
```

---

## 📊 Game Mechanics

### Scoring System
| Event | Points | Growth |
|-------|--------|--------|
| Death Star | 5 | +4 segments |
| Super Mario | 10 | +6 segments |
| Speed Level | 1-15 | Affects update rate |

### Speed Levels
| Level | Updates/Second | Difficulty |
|-------|------------------|-----------|
| 1-3 | 2-6 | Relaxing |
| 4-7 | 8-14 | Comfortable |
| 8-10 | 16-20 | Challenging |
| 11-15 | 22-30 | Intense |

### Canvas Specifications
- **Resolution**: 600×600 pixels
- **Grid**: 20×20 tiles at 30px each
- **Aspect Ratio**: 1:1 (square)
- **Frame Rate**: 60 FPS (rendering)

---

## 🚀 Performance Optimizations

- **Efficient Rendering**: Only redraws necessary elements per frame
- **Object Pooling**: Particle system reuses object references
- **Canvas Optimization**: Single context, minimal state changes
- **Audio Synthesis**: Timed oscillator cleanup to prevent memory leaks
- **Algorithm Efficiency**: O(n) collision detection, O(1) grid lookups

---

## 🔬 Learning Value

This project demonstrates professional game development patterns:

- **Game Loop Architecture** - Update/render separation
- **Particle Effects** - Physics simulation and lifecycle management
- **Audio Synthesis** - Web Audio API oscillator frequency modulation
- **Canvas 2D** - Advanced drawing techniques (bezier curves, gradients)
- **Game State Management** - Score, game over, restart logic
- **Input Handling** - Keyboard event buffering and direction validation
- **Performance** - RequestAnimationFrame timing and delta calculations

Perfect for learning or extending game mechanics!

---

## 🎓 Version History

### v2.0 - Enhanced Edition ✨
- **Realistic Snake Rendering** - Scales, curves, detailed head
- **Enhanced Audio** - Sawtooth melody, pizzazz blips, varied instruments
- **Massive Explosions** - Shockwave rings, particle spray, color variety
- **Animated Background** - 3 orbital planets with atmosphere
- **Aggressive Growth** - 4-6 segment growth per food item
- **Polish** - Refined visuals, improved particle effects, audio layering

### v1.0 - Initial Release
- Basic snake gameplay
- Death Star and Super Mario collectibles
- Simple particle effects
- Basic synth music

---

## 💾 Version Control

```bash
# Clone repository
git clone https://github.com/LarsFraMars/TheNextThing.git

# View commit history
git log --oneline

# Latest commits
git log -5
```

---

## 🤝 Contributing

Have ideas for improvements? The codebase is well-structured and documented:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

**Potential Enhancements:**
- [ ] Mobile touch controls
- [ ] Difficulty presets (Easy/Normal/Hard/Impossible)
- [ ] Power-ups (speed boost, temporary shield, etc.)
- [ ] Enemy obstacles and hazards
- [ ] Leaderboard system with local storage
- [ ] Multiple game modes (Classic, Time Attack, Survival)
- [ ] Sound toggle and volume control
- [ ] Snake skins and customization
- [ ] Pause functionality
- [ ] Level progression system

---

## 📝 License

This project is licensed under the MIT License - free to use, modify, and distribute.

```
MIT License - Use freely in personal and commercial projects
```

---

## 🙌 Credits & Inspiration

- **Star Wars** theme and aesthetic
- **Classic Snake Game** arcade mechanics
- **Retro Gaming** design principles
- **Web Audio API** for dynamic sound synthesis

---

## 🎮 Play Now!

### Quick Links
- 🎯 **Play**: Open `index.html` in your browser
- 📚 **Docs**: Read the full documentation above
- 💻 **Code**: Explore on GitHub
- 📊 **Track**: Monitor your high scores

---

## 🌟 Highlights

> *"A masterfully crafted blend of nostalgic arcade gameplay and modern web technologies"*

- ✅ **Zero Dependencies** - Pure vanilla JavaScript
- ✅ **Cross-Platform** - Works on any modern browser
- ✅ **Optimized Performance** - Smooth 60 FPS gameplay
- ✅ **Polished Visuals** - Professional particle effects and animations
- ✅ **Dynamic Audio** - Procedurally generated synth music
- ✅ **Well-Documented** - Clear code with extensive comments
- ✅ **Extensible** - Easy to modify and enhance

---

## 📞 Questions or Issues?

Found a bug? Have a feature request? Feel free to:
- Open an issue on GitHub
- Review the code comments
- Check the troubleshooting section below

### Troubleshooting

**Game won't load?**
- Ensure JavaScript is enabled
- Try a different browser (Chrome, Firefox, Safari recommended)
- Check browser console for errors (F12)

**Audio not working?**
- Grant browser permissions for audio
- Check volume settings
- Ensure Web Audio API is supported

**Slow performance?**
- Reduce speed level
- Close other browser tabs
- Try fullscreen mode (F11)

---

<div align="center">

### 🎮 Ready to Play?

**[Open Game](index.html)** • **[GitHub Repo](https://github.com/LarsFraMars/TheNextThing)** • **[View Code](script.js)**

---

**Made with ❤️ in JavaScript | 2026**

*May the Force be with your serpent! 🌌*

</div>
