const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements (DOM)
const scoreElement = document.getElementById('score-val');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const petitionMessage = document.getElementById('petition-message');

// Game State
let frames = 0;
let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let hasScroll = false; 

// Physics Constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = 12; 
// We now make groundHeight dynamic for mobile adjustments
let groundHeight = 50; 

// Obstacles Management
let obstacles = [];
let spawnTimer = 0; 

// The Scroll Item
let scrollItem = null; 

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

        // Use dynamic groundHeight
        if (this.y + this.height > canvas.height - groundHeight) {
            this.y = canvas.height - groundHeight - this.height; 
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
        y: canvas.height - groundHeight - 40, // Spawn on dynamic ground
        width: 40,
        height: 40,
        markedForDeletion: false
    });
}

function handleObstacles() {
    spawnTimer--;
    if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = 60 + Math.random() * 90; 
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        // Collision Check (Hen vs Cage)
        if (
            hen.x < obs.x + obs.width &&
            hen.x + hen.width > obs.x &&
            hen.y < obs.y + obs.height &&
            hen.y + hen.height > obs.y
        ) {
            gameOver();
        }

        if (obs.x + obs.width < 0) {
            obs.markedForDeletion = true;
            score++;
            scoreElement.innerText = score;
        }
    }
    obstacles = obstacles.filter(obs => !obs.markedForDeletion);
}

// Logic Only: Move the scroll and check collision
function updateScroll() {
    // 1. Spawn Logic: Only if score > 10, no scroll yet, and random chance
    if (score >= 10 && !hasScroll && !scrollItem) {
        if (Math.random() < 0.005) { 
            scrollItem = {
                x: canvas.width,
                y: canvas.height - groundHeight - 30, // ON GROUND now!
                width: 30,
                height: 30
            };
        }
    }

    // 2. Update Scroll Position & Collision
    if (scrollItem) {
        scrollItem.x -= gameSpeed;

        // Collision Check (Hen vs Scroll)
        if (
            hen.x < scrollItem.x + scrollItem.width &&
            hen.x + hen.width > scrollItem.x &&
            hen.y < scrollItem.y + scrollItem.height &&
            hen.y + hen.height > scrollItem.y
        ) {
            // COLLECTED!
            hasScroll = true;
            scrollItem = null; 
        }
        else if (scrollItem.x + scrollItem.width < 0) {
            scrollItem = null;
        }
    }
}

// Drawing Only
function drawScroll() {
    if (scrollItem) {
        ctx.fillStyle = '#FFD700'; 
        ctx.fillRect(scrollItem.x, scrollItem.y, scrollItem.width, scrollItem.height);
        
        ctx.fillStyle = '#000';
        ctx.font = '20px Courier';
        ctx.textAlign = 'left';
        ctx.fillText('?', scrollItem.x + 8, scrollItem.y + 22);
    }
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        ctx.fillStyle = '#95a5a6'; 
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
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

function drawUI() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px Courier';
    ctx.textAlign = 'right';
    ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}`, canvas.width - 10, 30);

    if (hasScroll) {
        ctx.font = '24px serif'; 
        ctx.textAlign = 'right'; 
        ctx.fillText('📜', canvas.width - 140, 30); 
    }
    
    ctx.textAlign = 'left';
}

function gameOver() {
    isGameOver = true;
    finalScoreElement.innerText = "Score: " + score;
    
    if (hasScroll) {
        petitionMessage.classList.remove('hidden'); 
    } else {
        petitionMessage.classList.add('hidden'); 
    }
    
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    hen.y = canvas.height - groundHeight - hen.height;
    hen.dy = 0;
    obstacles = [];
    spawnTimer = 0;
    frames = 0;
    score = 0;
    gameSpeed = 5;
    isGameOver = false;
    
    hasScroll = false;
    scrollItem = null;
    petitionMessage.classList.add('hidden');
    
    scoreElement.innerText = "0";
    gameOverScreen.classList.add('hidden');
    
    gameLoop();
}

function update() {
    frames++;
    hen.update();
    handleObstacles();
    updateScroll(); 
    
    if (frames % 1000 === 0) gameSpeed += 0.5;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#333'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Floor
    ctx.fillStyle = '#222';
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
    
    // Floor Line
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - groundHeight);
    ctx.lineTo(canvas.width, canvas.height - groundHeight);
    ctx.stroke();

    drawObstacles(); 
    drawScroll();    
    hen.draw();
    drawUI();       
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Mobile Portrait Adjustment
    if (canvas.height > canvas.width) {
        // In portrait, make the ground take up bottom 1/3
        // So the "Floor Line" is at 2/3 screen height
        groundHeight = canvas.height / 3;
    } else {
        // Desktop/Landscape
        groundHeight = 50;
    }
    
    // Recalculate Hen X Center
    hen.x = (canvas.width / 2) - (hen.width / 2);

    // Update positions of existing entities if resize happens live
    hen.y = canvas.height - groundHeight - hen.height;
    
    obstacles.forEach(obs => {
        obs.y = canvas.height - groundHeight - obs.height;
    });

    if (scrollItem) {
        scrollItem.y = canvas.height - groundHeight - scrollItem.height;
    }
}
window.addEventListener('resize', resize);

resize();
gameLoop();