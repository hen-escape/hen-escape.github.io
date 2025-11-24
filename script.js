const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game State
let frames = 0;
let score = 0;
let gameSpeed = 5;
let isGameOver = false;

// Physics Constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = 12; 
const GROUND_HEIGHT = 50; 

// The Main Character
const hen = {
    x: 50,
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
        // 1. Apply Gravity to Velocity
        this.dy += GRAVITY;

        // 2. Apply Velocity to Position (MOVE FIRST)
        this.y += this.dy;

        // 3. Check Floor Collision (CHECK LATER)
        // Note: canvas y increases downwards. 
        // If hen's bottom (y + height) > floor line
        if (this.y + this.height > canvas.height - GROUND_HEIGHT) {
            this.y = canvas.height - GROUND_HEIGHT - this.height; // Snap to floor
            this.dy = 0; // Stop falling
            this.grounded = true; // Allow jumping again
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
    hen.jump();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput();
});
document.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    handleInput();
});
document.addEventListener('mousedown', () => handleInput());

function resetGame() {
    // Reset Hen
    hen.y = canvas.height - hen.height - GROUND_HEIGHT;
    hen.dy = 0;
    
    // Reset Game Stats
    frames = 0;
    score = 0;
    gameSpeed = 5;
    isGameOver = false;
    
    gameLoop();
}

function update() {
    frames++;
    hen.update();
    
    // Speed Ramping
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
    
    // Floor Line
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
    ctx.stroke();

    // Hen
    hen.draw();
    
    // UI Debug
    ctx.fillStyle = 'white';
    ctx.font = '20px Courier';
    ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}`, 10, 30);
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
    // Snap to floor immediately on resize
    hen.y = canvas.height - hen.height - GROUND_HEIGHT;
}
window.addEventListener('resize', resize);

// Start
resize();
gameLoop();