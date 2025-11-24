const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreElement = document.getElementById('score-val');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Game State
let frames = 0;
let score = 0;
let gameSpeed = 5;
let isGameOver = false;

// Physics Constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = 12; 
const GROUND_HEIGHT = 50; 

// Obstacles Management
let obstacles = [];
let spawnTimer = 0; 

// The Main Character
const hen = {
    x: 0, 
    y: 0, 
    width: 40,
    height: 40,
    dy: 0,
    grounded: false,
    color: '#D35400', 
    
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Beak 
        ctx.fillStyle = '#F1C40F';
        ctx.fillRect(this.x + 30, this.y + 10, 15, 10);
        // Eye
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 25, this.y + 5, 5, 5);
    },
    
    update: function() {
        this.dy += GRAVITY;
        this.y += this.dy;

        if (this.y + this.height > canvas.height - GROUND_HEIGHT) {
            this.y = canvas.height - GROUND_HEIGHT - this.height; 
            this.dy = 0; 
            this.grounded = true; 
        } else {
            this.grounded = false;
        }
    },
    
    jump: function() {
        if (this.grounded) {
            this.dy = -JUMP_STRENGTH;
            this.grounded = false;
        }
    }
};

// Input Handling
function handleInput() {
    if (!isGameOver) {
        hen.jump();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput();
});
document.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    handleInput();
});
document.addEventListener('mousedown', () => handleInput());

restartBtn.addEventListener('click', () => {
    resetGame();
});

function spawnObstacle() {
    obstacles.push({
        x: canvas.width, 
        y: canvas.height - GROUND_HEIGHT - 40, 
        width: 40,
        height: 40,
        markedForDeletion: false
    });
}

function handleObstacles() {
    // 1. Spawning
    spawnTimer--;
    if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = 60 + Math.random() * 90; 
    }

    // 2. Moving & Collision (NO DRAWING HERE)
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        
        // Move
        obs.x -= gameSpeed;

        // Collision Check
        if (
            hen.x < obs.x + obs.width &&
            hen.x + hen.width > obs.x &&
            hen.y < obs.y + obs.height &&
            hen.y + hen.height > obs.y
        ) {
            gameOver();
        }

        // Check bounds
        if (obs.x + obs.width < 0) {
            obs.markedForDeletion = true;
            score++;
            scoreElement.innerText = score;
        }
    }
    
    // 3. Cleanup
    obstacles = obstacles.filter(obs => !obs.markedForDeletion);
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        
        // Draw Obstacle (Metallic Cage)
        ctx.fillStyle = '#95a5a6'; // Silver/Grey
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        // Cage Bars
        ctx.strokeStyle = '#2c3e50'; 
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        ctx.beginPath();
        ctx.moveTo(obs.x + 13, obs.y); 
        ctx.lineTo(obs.x + 13, obs.y + obs.height);
        ctx.moveTo(obs.x + 26, obs.y); 
        ctx.lineTo(obs.x + 26, obs.y + obs.height);
        ctx.stroke();
    }
}

function gameOver() {
    isGameOver = true;
    finalScoreElement.innerText = "Score: " + score;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    hen.y = canvas.height - hen.height - GROUND_HEIGHT;
    hen.dy = 0;
    obstacles = [];
    spawnTimer = 0;
    frames = 0;
    score = 0;
    gameSpeed = 5;
    isGameOver = false;
    
    scoreElement.innerText = "0";
    gameOverScreen.classList.add('hidden');
    
    gameLoop();
}

function update() {
    frames++;
    hen.update();
    handleObstacles();
    if (frames % 1000 === 0) gameSpeed += 0.5;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#333'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Floor
    ctx.fillStyle = '#222';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
    ctx.stroke();

    // Draw Obstacles (Now called inside draw!)
    drawObstacles();

    // Hen
    hen.draw();
    
    // UI Speed
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px Courier';
    ctx.textAlign = 'right';
    ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}`, canvas.width - 10, 30);
    ctx.textAlign = 'left';
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialization
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    hen.x = (canvas.width / 2) - (hen.width / 2);
    hen.y = canvas.height - hen.height - GROUND_HEIGHT;
}
window.addEventListener('resize', resize);

resize();
gameLoop();