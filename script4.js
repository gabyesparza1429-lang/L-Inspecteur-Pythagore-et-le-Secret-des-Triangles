let currentStep = 0; // 0: Inicio, 1: Lire, 2: Dessiner, 3: Choisir, 4: Calculer
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// 1. GESTIÓN DE PASOS
function nextStep(step) {
    if (step !== currentStep + 1) {
        alert("Sergio, suis l'ordre du plan !");
        return;
    }
    currentStep = step;
    document.querySelectorAll('.step-box').forEach(b => b.classList.remove('active'));
    document.getElementById(['step-read','step-draw','step-choose','step-calc'][step-1]).classList.add('active');

    if (step === 1) alert("Problème: L'échelle mesure 5m, la base est à 3m. Trouve la hauteur !");
    if (step === 2) animateDrawing();
    if (step === 3) alert("Formule choisie: a² + b² = c²");
    if (step === 4) document.getElementById('mini-calc').classList.remove('hidden');
}

// Vinculamos los clics a los pasos
document.getElementById('step-read').onclick = () => nextStep(1);
document.getElementById('step-draw').onclick = () => nextStep(2);
document.getElementById('step-choose').onclick = () => nextStep(3);
document.getElementById('step-calc').onclick = () => nextStep(4);

// 2. DIBUJO ANIMADO
function animateDrawing() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let p = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#39FF14"; ctx.lineWidth = 5;
        ctx.shadowBlur = 10; ctx.shadowColor = "#39FF14";
        
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(50 + (150 * Math.min(p, 1)), 250); // Base
        if(p > 1) ctx.lineTo(50, 250 - (180 * Math.min(p-1, 1))); // Altura
        ctx.closePath(); ctx.stroke();
        
        p += 0.05;
        if (p < 2.2) requestAnimationFrame(draw);
    }
    draw();
}

// 3. CALCULADORA FUNCIONAL
let calcVal = "";
function calcInput(n) { calcVal += n; updateDisplay(); }
function calcOp(o) { calcVal += o; updateDisplay(); }
function calcClear() { calcVal = ""; updateDisplay(); }
function updateDisplay() { document.getElementById('calc-display').innerText = calcVal || "0"; }
function calcRes() {
    try {
        calcVal = eval(calcVal).toString();
        updateDisplay();
    } catch { calcClear(); }
}
function calcSqrt() {
    try {
        calcVal = Math.sqrt(eval(calcVal)).toFixed(2);
        updateDisplay();
    } catch { calcClear(); }
}

// Para finalizar la misión (Examen Final)
function checkFinal() {
    const res = document.getElementById('calc-display').innerText;
    if (res == "4") {
        alert("BRAVO SERGIO ! Tu es le Maître de la Modélisation !");
        localStorage.setItem('mision4_completed', 'true');
        window.location.href = 'index.html';
    } else {
        alert("Calcul incorrect pour la hauteur (√16)");
    }
}
