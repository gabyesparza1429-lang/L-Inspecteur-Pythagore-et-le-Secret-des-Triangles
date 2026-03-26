const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');

// Ajuste de resolución dinámica
function init() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.onload = init;
window.onresize = init;

// Lógica de dibujo (Soporta iPad/Touch)
let drawing = false;
function startDraw(e) { drawing = true; draw(e); }
function endDraw() { drawing = false; ctx.beginPath(); }
function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = '#2ecc71';
    ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
}
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('touchstart', startDraw);
window.addEventListener('mouseup', endDraw);
window.addEventListener('touchend', endDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

// Lógica de Teclado y Auto-salto
const inputs = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];
const respuestas = { 'step-a2': 9, 'step-b2': 16, 'step-sum': 25, 'step-sqrt': 5 };

inputs.forEach((id, index) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
        if (parseInt(input.value) === respuestas[id]) {
            input.style.backgroundColor = "#d4efdf";
            input.style.borderColor = "#2ecc71";
            // Salta al siguiente
            if (index < inputs.length - 1) {
                document.getElementById(inputs[index+1]).focus();
            }
        } else {
            input.style.backgroundColor = "white";
        }
    });
});

// Drag & Drop (Simplificado)
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        t.innerText = e.dataTransfer.getData('text');
        t.style.background = "#d4efdf";
        if(document.getElementById('label-a').innerText !== '?' && document.getElementById('label-b').innerText !== '?') {
            document.getElementById('step-panel').classList.remove('hidden');
        }
    };
});
