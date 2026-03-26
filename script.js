const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');

function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}
window.addEventListener('resize', resize);
resize();

let drawing = false;

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    // Esto calcula la posición real sin importar el tamaño del zoom
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('touchstart', (e) => { drawing = true; e.preventDefault(); });
window.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
window.addEventListener('touchend', () => { drawing = false; ctx.beginPath(); });

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2ecc71';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2ecc71';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
});

// Arrastrar y soltar mejorado
document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.target.innerText));
});

document.querySelectorAll('.drop-target').forEach(t => {
    t.addEventListener('dragover', e => e.preventDefault());
    t.addEventListener('drop', e => {
        t.innerText = e.dataTransfer.getData('text');
        t.style.background = "#d4efdf";
        check();
    });
});

function check() {
    const targets = document.querySelectorAll('.drop-target');
    if (targets[0].innerText !== '?' && targets[1].innerText !== '?') {
        document.getElementById('check-btn').classList.remove('hidden');
    }
}

function verifier() {
    alert("Super Sergio! Mission 1 terminée!");
}
