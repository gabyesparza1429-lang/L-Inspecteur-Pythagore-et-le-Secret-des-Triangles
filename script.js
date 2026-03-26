const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');

// Ajustar resolución del canvas al tamaño real que se ve
function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let drawing = false;

// Dibujo adaptable
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('touchstart', () => drawing = true);
window.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
window.addEventListener('touchend', () => { drawing = false; ctx.beginPath(); });

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2ecc71';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.moveTo(pos.x, pos.y);
}

// Drag & Drop
document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.target.innerText));
});

document.querySelectorAll('.drop-target').forEach(t => {
    t.addEventListener('dragover', e => e.preventDefault());
    t.addEventListener('drop', e => {
        t.innerText = e.dataTransfer.getData('text');
        t.style.background = "#e8f8f5";
        checkProgress();
    });
});

function checkProgress() {
    const targets = document.querySelectorAll('.drop-target');
    if (targets[0].innerText !== '?' && targets[1].innerText !== '?') {
        document.getElementById('check-btn').classList.remove('hidden');
    }
}

function verifier() {
    alert("Bravo Sergio! 3² + 4² = 25. La racine carrée est 5!");
}
