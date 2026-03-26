// 1. CONFIGURACIÓN DE DATOS (10 EJERCICIOS)
const missionData = [
    {a:3, b:4, c:5}, {a:6, b:8, c:10}, {a:5, b:12, c:13}, 
    {a:9, b:12, c:15}, {a:8, b:15, c:17}, {a:12, b:16, c:20},
    {a:7, b:24, c:25}, {a:20, b:21, c:29}, {a:10, b:24, c:26}, {a:15, b:20, c:25}
];
let currentLevel = 0;

// 2. INICIALIZACIÓN DE CANVAS
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');

function initCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// 3. LÓGICA DE ARRASTRAR Y SOLTAR (CORREGIDA)
function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const targets = document.querySelectorAll('.drop-label');

    draggables.forEach(d => {
        d.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.innerText);
            e.target.style.opacity = "0.5";
        });
        d.addEventListener('dragend', (e) => {
            e.target.style.opacity = "1";
        });
    });

    targets.forEach(t => {
        t.addEventListener('dragover', (e) => {
            e.preventDefault(); // Crítico para permitir soltar
            t.style.backgroundColor = "rgba(46, 204, 113, 0.3)";
        });

        t.addEventListener('dragleave', () => {
            t.style.backgroundColor = "rgba(255,255,255,0.7)";
        });

        t.addEventListener('drop', (e) => {
            e.preventDefault();
            const valorRecibido = e.dataTransfer.getData('text/plain');
            t.innerText = valorRecibido;
            t.style.backgroundColor = "#d4efdf";
            t.style.border = "3px solid #2ecc71";
            
            checkIfBothDropped();
        });
    });
}

function checkIfBothDropped() {
    const lA = document.getElementById('label-a').innerText;
    const lB = document.getElementById('label-b').innerText;
    
    if (lA !== '?' && lB !== '?') {
        document.getElementById('step-panel').classList.remove('hidden');
        document.getElementById('guide-text').innerText = "Bien! Maintenant, calcule les carrés.";
        document.getElementById('step-a2').focus();
    }
}

// 4. LÓGICA DE TECLADO (AUTO-SALTO)
const inputIds = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];
inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
        const val = parseInt(input.value);
        const data = missionData[currentLevel];
        let correct = false;

        if(id === 'step-a2') correct = (val === data.a ** 2);
        if(id === 'step-b2') correct = (val === data.b ** 2);
        if(id === 'step-sum') correct = (val === (data.a**2 + data.b**2));
        if(id === 'step-sqrt') correct = (val === data.c);

        if(correct) {
            input.style.borderColor = "#2ecc71";
            input.style.backgroundColor = "#e8f8f5";
            if(id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
            } else {
                document.getElementById(inputIds[idx + 1]).focus();
            }
        }
    });
});

// 5. CAMBIO DE NIVEL
function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    document.getElementById('val1').innerText = data.a;
    document.getElementById('val2').innerText = data.b;
    
    // Resetear labels
    const la = document.getElementById('label-a');
    const lb = document.getElementById('label-b');
    la.innerText = "?"; la.style.backgroundColor = "rgba(255,255,255,0.7)"; la.style.border = "2px dashed #3498db";
    lb.innerText = "?"; lb.style.backgroundColor = "rgba(255,255,255,0.7)"; lb.style.border = "2px dashed #3498db";
    
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('guide-text').innerText = "Glisse " + data.a + " et " + data.b + " sur le triangle.";
    
    document.querySelectorAll('input').forEach(i => { i.value = ""; i.style.borderColor = "#bdc3c7"; });
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) { loadLevel(); } 
    else { alert("FÉLICITATIONS SERGIO ! MISSION TERMINÉE !"); }
}

// 6. DIBUJO (COMPATIBLE TOUCH)
let drawing = false;
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('touchstart', (e) => { drawing = true; e.preventDefault(); });
window.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
window.addEventListener('touchend', () => { drawing = false; ctx.beginPath(); });

canvas.addEventListener('mousemove', (e) => {
    if(!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 4; ctx.strokeStyle = '#2ecc71'; ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke(); ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

// INICIO
window.onload = () => {
    initCanvas();
    setupDragAndDrop();
    loadLevel();
};
