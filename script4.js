const levels = [
    { txt: "L'échelle: mesure 5m (diagonale), base à 3m. Trouve la hauteur !", a: "3m", b: "?", c: "5m", target: 4 },
    { txt: "L'arbre: il faisait 10m, la base est à 6m. Trouve le côté a !", a: "?", b: "6m", c: "10m", target: 8 },
    { txt: "La TV: Base 80cm, Hauteur 60cm. Trouve la diagonale c !", a: "60cm", b: "80cm", c: "?", target: 100 },
    { txt: "La Rampe: Diagonale 5m, hauteur 4m. Trouve la base !", a: "4m", b: "?", c: "5m", target: 3 },
    { txt: "Le Toit: Côté a=12m, Côté b=5m. Trouve la viga c !", a: "12m", b: "5m", c: "?", target: 13 }
];

let curLevel = 0;
let pencilActive = false;
let isDrawing = false;
let startX, startY;
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function loadLevel() {
    document.getElementById('problem-text').innerText = levels[curLevel].txt;
    document.querySelectorAll('.measure-hint').forEach(h => h.classList.remove('visible'));
    document.getElementById('mini-calc').classList.add('hidden');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pencilActive = false;
    
    // Reset de botones
    document.getElementById('step-2').classList.add('locked');
    document.getElementById('step-3').classList.add('locked');
}

function executeStep(s) {
    if (s === 1) { // Leer
        document.getElementById('step-2').classList.remove('locked');
        alert("Sergio: Utilise le crayon pour tracer le triangle sur le plan !");
    }
}

function activatePencil() {
    pencilActive = true;
    document.getElementById('pencil-tool').style.background = "#39FF14";
    alert("Crayon activé ! Dessine maintenant.");
}

// Dibujo para Sergio
canvas.onmousedown = (e) => {
    if(!pencilActive) return;
    isDrawing = true;
    startX = e.offsetX; startY = e.offsetY;
};

canvas.onmousemove = (e) => {
    if (!isDrawing) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 5; ctx.shadowBlur = 10; ctx.shadowColor = '#39FF14';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};

canvas.onmouseup = (e) => {
    if(!isDrawing) return;
    isDrawing = false;
    // Mostrar pistas al terminar de dibujar
    showHints(e.offsetX, e.offsetY);
    document.getElementById('step-3').classList.remove('locked');
    document.getElementById('mini-calc').classList.remove('hidden');
};

function showHints(endX, endY) {
    const hA = document.getElementById('hint-a');
    const hB = document.getElementById('hint-b');
    const hC = document.getElementById('hint-c');

    hA.innerText = "a = " + levels[curLevel].a;
    hA.style.left = startX - 60 + "px"; hA.style.top = startY + "px";
    hA.classList.add('visible');

    hB.innerText = "b = " + levels[curLevel].b;
    hB.style.left = startX + 50 + "px"; hB.style.top = startY + 50 + "px";
    hB.classList.add('visible');

    hC.innerText = "c = " + levels[curLevel].c;
    hC.style.left = endX - 30 + "px"; hC.style.top = endY - 40 + "px";
    hC.classList.add('visible');
}

// Calculadora
let cVal = "";
function calcIn(n) { cVal += n; document.getElementById('calc-display').innerText = cVal; }
function calcOp(o) { cVal += o; document.getElementById('calc-display').innerText = cVal; }
function calcClear() { cVal = ""; document.getElementById('calc-display').innerText = "0"; }
function calcRes() { try { cVal = eval(cVal).toString(); document.getElementById('calc-display').innerText = cVal; } catch(e) { calcClear(); } }
function calcSqrt() { cVal = Math.sqrt(eval(cVal)).toFixed(0); document.getElementById('calc-display').innerText = cVal; }

function checkAnswer() {
    const ans = parseInt(document.getElementById('calc-display').innerText);
    if (ans === levels[curLevel].target) {
        document.getElementById('success-modal').classList.remove('hidden');
    } else {
        document.getElementById('error-modal').classList.remove('hidden');
    }
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function nextLevel() {
    curLevel++;
    closeModal('success-modal');
    if (curLevel < levels.length) {
        loadLevel();
    } else {
        alert("FÉLICITATIONS ! Sergio, tu es un Maître Architecte !");
        localStorage.setItem('mision4_completed', 'true');
        window.location.href = 'index.html';
    }
}

window.onload = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    loadLevel();
};
