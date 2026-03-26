// 1. DATOS DE LA MISIÓN 2 (Buscando un cateto - Resta)
const missionData = [
    {c:5, b:4, a:3}, {c:10, b:8, a:6}, {c:13, b:12, a:5},
    {c:15, b:12, a:9}, {c:17, b:15, a:8}, {c:20, b:16, a:12},
    {c:25, b:24, a:7}, {c:26, b:24, a:10}, {c:29, b:21, a:20}, {c:25, b:20, a:15}
];

let currentLevel = 0;
const container = document.getElementById('game-container');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// 2. CARGAR NIVEL
function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // Poner los números en las cajas amarillas
    document.getElementById('val1').innerText = data.c; // Hipotenusa
    document.getElementById('val2').innerText = data.b; // Cateto conocido
    
    // Reset de etiquetas en el triángulo
    document.getElementById('label-c').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('label-c').style.backgroundColor = "rgba(255,255,255,0.85)";
    document.getElementById('label-b').style.backgroundColor = "rgba(255,255,255,0.85)";
    
    // Ocultar panel de cálculos y limpiar inputs
    document.getElementById('step-panel').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { 
        i.value = ""; 
        i.style.borderColor = "#bdc3c7"; 
        i.classList.remove('input-error');
    });

    document.getElementById('guide-text').innerText = "Trouve le côté secret (Soustraction).";
    if(canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 3. CONTROL DE ERRORES (MODAL)
function showError(msg) {
    document.getElementById('error-msg').innerText = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}

function closeError() {
    document.getElementById('error-modal').classList.add('hidden');
}

// 4. DRAG AND DROP
document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', e.target.innerText));
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
        e.preventDefault();
        const valor = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];

        // VALIDACIÓN: La hipotenusa (c) siempre debe ir en label-c
        if (t.id === 'label-c' && valor !== data.c) {
            showError("Attention Sergio ! L'hypoténuse (" + data.c + ") est le côté le plus long. Elle doit aller sur la diagonale.");
            return;
        }

        t.innerText = valor;
        t.style.backgroundColor = "#d4efdf";
        
        if (document.getElementById('label-c').innerText !== '?' && document.getElementById('label-b').innerText !== '?') {
            document.getElementById('step-panel').classList.remove('hidden');
            document.getElementById('step-c2').focus();
        }
    });
});

// 5. VALIDACIÓN DE CÁLCULOS (PASO A PASO)
const inputIds = ['step-c2', 'step-a2', 'step-minus', 'step-sqrt'];

inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    
    input.addEventListener('change', () => {
        const val = parseInt(input.value);
        if (isNaN(val)) return;

        const data = missionData[currentLevel];
        let isCorrect = false;
        let msg = "";

        if (id === 'step-c2') {
            isCorrect = (val === data.c ** 2);
            msg = (val === data.c) ? "Calcule le CARRÉ (c²) !" : "Incorrect.";
        } else if (id === 'step-a2') {
            isCorrect = (val === data.b ** 2);
            msg = (val === data.b) ? "Calcule le CARRÉ du côté !" : "Incorrect.";
        } else if (id === 'step-minus') {
            isCorrect = (val === (data.c**2 - data.b**2));
            msg = "La soustraction est fausse ! (c² - a²)";
        } else if (id === 'step-sqrt') {
            // Buscamos el lado 'a' que es el resultado final
            isCorrect = (val === data.a);
            msg = "Le côté manquant est incorrect. Utilise la touche √ !";
        }

        if (isCorrect) {
            input.style.borderColor = "#2ecc71";
            input.classList.remove('input-error');
            if (id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
            } else {
                document.getElementById(inputIds[idx + 1]).focus();
            }
        } else {
            input.classList.add('input-error');
            showError(msg);
            input.value = ""; 
        }
    });
});

// 6. CALCULADORA
let currentCalc = "";
function toggleCalc() { document.getElementById('mini-calc').classList.toggle('hidden'); }
function calcInput(num) { currentCalc += num; document.getElementById('calc-display').innerText = currentCalc; }
function calcOp(op) { currentCalc += " " + op + " "; document.getElementById('calc-display').innerText = currentCalc; }
function calcClear() { currentCalc = ""; document.getElementById('calc-display').innerText = "0"; }
function calcRes() { 
    try { 
        currentCalc = eval(currentCalc.replace('×', '*').replace('÷', '/')).toString(); 
        document.getElementById('calc-display').innerText = currentCalc; 
    } catch(e) { calcClear(); } 
}
function calcSqrt() { 
    try { 
        let val = eval(currentCalc.replace('×', '*').replace('÷', '/'));
        let res = Math.sqrt(val);
        currentCalc = (Math.round(res * 100) / 100).toString(); 
        document.getElementById('calc-display').innerText = "√ = " + currentCalc; 
    } catch(e) { calcClear(); } 
}

// 7. SIGUIENTE NIVEL
function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) {
        loadLevel();
    } else {
        localStorage.setItem('mision2_completed', 'true'); 
        window.location.href='index.html'; 
    }
}

// 8. INICIO
window.onload = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    loadLevel();
};
