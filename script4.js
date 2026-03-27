const retos = [
    { titulo: "La Escalera", texto: "L'échelle mesure 5m (hypoténuse), la base est à 3m. Trouve la hauteur (a).", target: 4 },
    { titulo: "L'Arbre Cassé", texto: "L'arbre mesurait 10m. Il touche le sol à 6m de la base. Quelle est la hauteur restante?", target: 8 },
    { titulo: "Écran Géant", texto: "Base 80cm, Hauteur 60cm. Quelle est la mesure de la diagonale?", target: 100 },
    { titulo: "Rampe Skate", texto: "Longueur de la rampe 5m, base 3m. Quelle est la hauteur?", target: 4 },
    { titulo: "Le Toit", texto: "Viga A=12, Viga B=5. Trouve la longueur de la viga principale (c).", target: 13 }
];

let nivel = 0;
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cargarReto();
}

function cargarReto() {
    document.getElementById('current-ex').innerText = nivel + 1;
    document.getElementById('mission-title').innerText = retos[nivel].titulo;
    document.getElementById('problem-text').innerText = "Cliquez sur 'Lire' pour analyser le plan technique.";
    resetSteps();
}

function resetSteps() {
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.classList.add('locked');
        btn.classList.remove('active');
    });
    document.getElementById('step-1').classList.remove('locked');
    document.getElementById('mini-calc').classList.add('hidden');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function executeStep(s) {
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
        document.getElementById('problem-text').innerText = "Utilise la formule: a² + b² = c². Calcule la valeur manquante.";
        document.getElementById('step-4').classList.remove('locked');
    }
    else if (s === 4) { // CALCULER
        document.getElementById('mini-calc').classList.remove('hidden');
    }
}

function dibujarTrianguloNeon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#39FF14';

    ctx.beginPath();
    // Triángulo centrado en el área de la casa
    ctx.moveTo(canvas.width * 0.3, canvas.height * 0.7);
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.7); // Base
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.3); // Hipotenusa
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// Lógica de Calculadora
let calcVal = "";
function calcInput(v) { calcVal += v; updateCalc(); }
function calcOp(o) { calcVal += o; updateCalc(); }
function calcClear() { calcVal = ""; updateCalc(); }
function updateCalc() { document.getElementById('calc-display').innerText = calcVal || "0"; }
function calcRes() { try { calcVal = eval(calcVal).toString(); updateCalc(); } catch { calcClear(); } }
function calcSqrt() { try { calcVal = Math.sqrt(eval(calcVal)).toFixed(0); updateCalc(); } catch { calcClear(); } }

function checkFinalAnswer() {
    const r = document.getElementById('calc-display').innerText;
    if (parseInt(r) === retos[nivel].target) {
        document.getElementById('bravo-modal').classList.remove('hidden');
    } else {
        alert("Attention Sergio ! Vérifie tes calculs sur la calculatrice.");
    }
}

function nextReto() {
    nivel++;
    document.getElementById('bravo-modal').classList.add('hidden');
    calcClear();
    if (nivel < retos.length) cargarReto();
    else {
        alert("FÉLICITATIONS ! Tu as terminé toutes les missions !");
        localStorage.setItem('mision4_completed', 'true');
        window.location.href = 'index.html';
    }
}

window.onload = init;
