const levels = [
    { txt: "L'échelle mesure 5m, la base est à 3m. Trouve la hauteur !", a: "3m", b: "?", c: "5m", target: 4 },
    { txt: "Le toit: base 8m, hauteur 6m. Trouve la viga (c) !", a: "8m", b: "6m", c: "?", target: 10 }
];

let curLevel = 0;
let isDrawing = false;
let startX, startY;
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    loadLevel();
}

function loadLevel() {
    document.getElementById('instruction-bar').innerText = levels[curLevel].txt;
    document.getElementById('mini-calc').classList.add('hidden');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetSteps();
}

// Lógica de dibujo para Sergio
canvas.onmousedown = (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    document.getElementById('step-2').classList.add('active');
};

canvas.onmousemove = (e) => {
    if (!isDrawing) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 5; ctx.shadowBlur = 10; ctx.shadowColor = '#39FF14';
    
    // Dibuja línea recta desde el punto inicial al actual
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};

canvas.onmouseup = () => {
    isDrawing = false;
    // Al soltar, aparecen las pistas cerca de donde dibujó
    showHints();
    document.getElementById('step-3').classList.add('active');
    document.getElementById('mini-calc').classList.remove('hidden');
};

function showHints() {
    const hA = document.getElementById('hint-a');
    hA.innerText = levels[curLevel].a;
    hA.style.left = (startX - 40) + "px";
    hA.style.top = (startY + 50) + "px";
    hA.classList.add('visible');
    
    const hC = document.getElementById('hint-c');
    hC.innerText = levels[curLevel].c;
    hC.style.left = (startX + 100) + "px";
    hC.style.top = (startY - 20) + "px";
    hC.classList.add('visible');
}

// Calculadora
let calcVal = "";
function calcIn(n) { calcVal += n; updateDisp(); }
function updateDisp() { document.getElementById('calc-display').innerText = calcVal || "0"; }
function calcClear() { calcVal = ""; updateDisp(); }
function calcRes() { try { calcVal = eval(calcVal).toString(); updateDisp(); } catch(e) { calcClear(); } }
function calcSqrt() { calcVal = Math.sqrt(eval(calcVal)).toFixed(0); updateDisp(); }

function checkAnswer() {
    const val = parseInt(document.getElementById('calc-display').innerText);
    if (val === levels[curLevel].target) {
        document.getElementById('success-modal').classList.remove('hidden');
    } else {
        document.getElementById('error-text').innerText = "Vérifie tes calculs. Utilise la formule a² + b² = c²";
        document.getElementById('error-modal').classList.remove('hidden');
    }
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function nextLevel() { 
    curLevel++; 
    closeModal('success-modal');
    if(curLevel < levels.length) loadLevel(); 
    else alert("Mission Complétée !");
}

window.onload = init;
