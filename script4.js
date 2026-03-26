const retos = [
    { titulo: "La Escalera", texto: "Fenêtre à 4m, base à 3m. Quelle est la longueur de l'échelle?", a: 3, b: 4, c: 5, tipo: 'c' },
    { titulo: "L'Arbre Cassé", texto: "Arbre de 10m (hypoténuse), base à 6m. Hauteur du tronc?", a: 8, b: 6, c: 10, tipo: 'a' },
    { titulo: "Écran Géant", texto: "Base 80cm, Hauteur 60cm. Diagonale?", a: 60, b: 80, c: 100, tipo: 'c' },
    { titulo: "Rampe Skate", texto: "Rampe (hypoténuse) 5m, base 3m. Hauteur?", a: 4, b: 3, c: 5, tipo: 'a' },
    { titulo: "Le Toit", texto: "Viga A: 12, Viga B: 5. Quelle est la viga longue?", a: 5, b: 12, c: 13, tipo: 'c' }
];

let nivel = 0;
let stepActual = 1;
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cargarReto();
}

function cargarReto() {
    stepActual = 1;
    document.getElementById('current-ex').innerText = nivel + 1;
    document.getElementById('mission-title').innerText = retos[nivel].titulo;
    document.getElementById('problem-text').innerText = "Cliquez sur 'Lire' pour commencer.";
    resetSteps();
}

function resetSteps() {
    document.querySelectorAll('.step-btn').forEach((btn, i) => {
        btn.classList.add('locked');
        btn.classList.remove('active');
    });
    document.getElementById('step-1').classList.remove('locked');
    document.getElementById('mini-calc').classList.add('hidden');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function executeStep(s) {
    if (document.getElementById(`step-${s}`).classList.contains('locked')) return;
    
    stepActual = s;
    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`step-${s}`).classList.add('active');

    if (s === 1) { // LIRE
        document.getElementById('problem-text').innerText = retos[nivel].texto;
        document.getElementById('step-2').classList.remove('locked');
    } 
    else if (s === 2) { // DESSINER
        dibujarTrianguloNeon();
        document.getElementById('step-3').classList.remove('locked');
    }
    else if (s === 3) { // CHOISIR
        alert("Modèle validé ! Utilisez la calculatrice pour trouver la valeur manquante.");
        document.getElementById('step-4').classList.remove('locked');
    }
    else if (s === 4) { // CALCULER
        document.getElementById('mini-calc').classList.remove('hidden');
    }
}

function dibujarTrianguloNeon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39FF14';

    ctx.beginPath();
    ctx.moveTo(100, 350);
    ctx.lineTo(400, 350); // Base
    ctx.lineTo(100, 100); // Hipotenusa
    ctx.closePath();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#34495e";
    ctx.font = "20px Arial";
    ctx.fillText("?", 250, 220);
}

function checkFinalAnswer() {
    const r = document.getElementById('final-answer').value;
    const correct = retos[nivel].tipo === 'c' ? retos[nivel].c : retos[nivel].a;
    
    if (parseInt(r) === correct) {
        document.getElementById('bravo-modal').classList.remove('hidden');
    } else {
        alert("Presque ! Réessaie le calcul.");
    }
}

function nextReto() {
    nivel++;
    document.getElementById('bravo-modal').classList.add('hidden');
    document.getElementById('final-answer').value = "";
    if (nivel < retos.length) cargarReto();
    else {
        alert("FÉLICITATIONS SERGIO ! Tu as maîtrisé la modélisation !");
        window.location.href = 'index.html';
    }
}

// Lógica básica de calculadora
let calcVal = "";
function calcInput(v) { calcVal += v; updateCalc(); }
function calcClear() { calcVal = ""; updateCalc(); }
function updateCalc() { document.getElementById('calc-display').innerText = calcVal || "0"; }
function calcRes() { try { calcVal = eval(calcVal).toString(); updateCalc(); } catch { calcClear(); } }
function calcSqrt() { calcVal = Math.sqrt(eval(calcVal)).toFixed(2); updateCalc(); }

window.onload = init;
