# 🐔 Hen Escape - Cage Free (逃出蛋工廠)

> An HTML5 Infinite Runner with a mission to raise awareness for cage-free hens.

**Hen Escape** is a lightweight, responsive web game where players control a hen attempting to escape a battery cage factory. The game combines retro arcade mechanics with a social impact message, encouraging players to unlock the "Hidden Truth" and sign the **Cage-Free HK** petition.

## 🎮 Game Features

* **Infinite Runner Mechanics:** Procedurally generated obstacles and increasing speed create an endless challenge.
* **Atmospheric Visuals:** A multi-layered parallax background featuring procedurally drawn machinery and battery cages to immerse the player in the factory setting.
* **Responsive Design:** Optimized for both Desktop (Landscape) and Mobile (Portrait).
* **"Hidden Truth" Mechanic:** A rare collectible Scroll appears after a specific score threshold. Collecting it unlocks a special Game Over dialog with a call-to-action link.
* **Lightweight Tech Stack:** Built with 100% Vanilla JavaScript and HTML5 Canvas. Zero external dependencies.

## 🕹️ How to Play

**Objective:** Escape the factory!

### Controls
* **Desktop:** Press `Spacebar` or `Click` the screen to jump.
* **Mobile:** `Tap` the screen to jump.

### The Secret
Keep an eye out for a **Golden Box** appearing on the ground after you pass a few obstacles. Collecting it reveals the **Truth Scroll** at the end of the game.

## 📂 Project Structure

This project follows a clean separation of concerns. All source code is located in the `src/` directory.

```text
hen-escape/
│
├── README.md           # Project Documentation
│
└── src/                # Source Code
    ├── index.html      # Game container and UI structure
    ├── style.css       # Responsive styling and animations
    ├── script.js       # Game loop, physics engine, and logic
    └── hen-escape.png  # Title screen logo asset
```

## 🚀 How to Run & Deploy

### Local Development
1.  Clone or download this repository.
2.  Navigate to the `src/` folder.
3.  Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
    * *Tip:* For the best experience, use a local server (e.g., Live Server in VS Code) to prevent CORS issues, though this game will run directly from the file system.

### Deployment (Netlify / Vercel / GitHub Pages)
When deploying this project to a static site host:
* **Root Directory:** Set the publish directory to `src`.
* **Entry Point:** Ensure the host looks for `index.html` inside `src`.

## 🛠️ Technologies Used

* **HTML5 Canvas:** For high-performance 2D rendering (60 FPS).
* **CSS3:** For responsive layouts, animations, and "parchment" UI effects.
* **Vanilla JavaScript (ES6+):**
    * Custom physics engine (Gravity/Velocity).
    * Object pooling for obstacles.
    * Event bubbling management for clean input handling.

## 📜 Credits

* **Development:** Generated with Gemini AI
* **Developer:** [@po-man](https://github.com/po-man)

---

*This game was built to support the **Cage-Free HK** initiative. Learn more at [planet4all.org/cage-free-hk](https://www.planet4all.org/cage-free-hk).*
