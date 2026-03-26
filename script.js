const missionData = [
    {a:3, b:4, c:5}, {a:6, b:8, c:10}, {a:5, b:12, c:13}, 
    {a:9, b:12, c:15}, {a:8, b:15, c:17}, {a:12, b:16, c:20},
    {a:7, b:24, c:25}, {a:20, b:21, c:29}, {a:10, b:24, c:26}, {a:15, b:20, c:25}
];

let currentLevel = 0;
const container = document.getElementById('game-container');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    document.getElementById('val1').innerText = data.a;
    document.getElementById('val2').innerText = data.b;
    
    // Resetear labels del triángulo
    const la = document.getElementById('label-a');
    const lb = document.getElementById('label-b');
    la.innerText = "?"; la.style.backgroundColor = "rgba(255,255,255,0.8)";
    lb.innerText = "?"; lb.style.backgroundColor = "rgba(255,255,255,0.8)";
    
    // Ocultar paneles
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('guide-text').innerText = "Glisse " + data.a + " et " + data.b + " sur le triangle.";
    
    // Limpiar inputs y errores
    document.querySelectorAll('input').forEach(i => { 
        i.value = ""; 
        i.style.borderColor = "#bdc3c7"; 
        i.classList.remove('input-error');
    });
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

// --- SISTEMA DE ADVERTENCIAS (Retroalimentación para Sergio) ---
function showError(msg) {
    document.getElementById('error-msg').innerText = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}
function closeError() {
    document.getElementById('error-modal').classList.add('hidden');
}

// --- DRAG AND DROP (Arrastrar números) ---
document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', e.target.innerText));
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
        e.preventDefault();
        const valorRecibido = e.dataTransfer.getData('text');
        t.innerText = valorRecibido;
        t.style.backgroundColor = "#d4efdf";
        checkIfBothDropped();
    });
});

function checkIfBothDropped() {
    const lA = document.getElementById('label-a').innerText;
    const lB = document.getElementById('label-b').innerText;
    if (lA !== '?' && lB !== '?') {
        document.getElementById('step-panel').classList.remove('hidden');
        document.getElementById('guide-text').innerText = "Calcule les carrés et la somme.";
        document.getElementById('step-a2').focus();
    }
}

// --- VALIDACIÓN DE CALCULOS ---
const inputIds = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];
inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    
    // Detectar si puso el número normal (no el cuadrado) al perder el foco
    input.addEventListener('change', () => {
        const val = parseInt(input.value);
        const data = missionData[currentLevel];
        if (id === 'step-a2' && val === data.a) {
            showError("Attention Sergio ! Calcule le CARRÉ (" + data.a + " x " + data.a + ")");
            input.value = ""; input.classList.add('input-error');
        }
        if (id === 'step-b2' && val === data.b) {
            showError("N'oublie pas le CARRÉ de " + data.b);
            input.value = ""; input.classList.add('input-error');
        }
    });

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
            input.classList.remove('input-error');
            if(id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
            } else {
                document.getElementById(inputIds[idx + 1]).focus();
            }
        }
    });
});

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) {
        loadLevel();
    } else {
        localStorage.setItem('mision1_completed', 'true'); // Guardar progreso
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `<h2>🏆 MISSION COMPLÉTÉE !</h2><p>Félicitations Sergio !</p><button onclick="window.location.href='index.html'">RETOUR AU MENU</button>`;
        document.getElementById('bravo-modal').classList.remove('hidden');
    }
}

// --- LÓGICA DE LA CALCULADORA INTEGRADA ---
let currentCalc = "";
function toggleCalc() {
    document.getElementById('mini-calc').classList.toggle('hidden');
}
function calcInput(num) {
    currentCalc += num;
    document.getElementById('calc-display').innerText = currentCalc;
}
function calcOp(op) {
    currentCalc += " " + op + " ";
    document.getElementById('calc-display').innerText = currentCalc;
}
function calcClear() {
    currentCalc = "";
    document.getElementById('calc-display').innerText = "0";
}
function calcRes() {
    try {
        let result = eval(currentCalc.replace('×', '*').replace('÷', '/'));
        currentCalc = result.toString();
        document.getElementById('calc-display').innerText = currentCalc;
    } catch (e) {
        document.getElementById('calc-display').innerText = "Err";
        currentCalc = "";
    }
// NUEVA FUNCIÓN PARA LA RAÍZ CUADRADA
function calcSqrt() {
    try {
        // Primero calculamos lo que esté en pantalla, luego sacamos raíz
        let currentVal = eval(currentCalc.replace('×', '*').replace('÷', '/'));
        let result = Math.sqrt(currentVal);
        
        // Redondeamos a 2 decimales por si no es exacta
        currentCalc = (Math.round(result * 100) / 100).toString();
        document.getElementById('calc-display').innerText = "√ = " + currentCalc;
    } catch (e) {
        document.getElementById('calc-display').innerText = "Err";
        currentCalc = "";
    }
}

// INICIO
window.onload = () => {
    initCanvas();
    loadLevel();
};
