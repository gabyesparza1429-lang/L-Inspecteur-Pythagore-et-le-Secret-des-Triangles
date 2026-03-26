// 1. BASE DE DATOS DE LA MISIÓN 1 (10 EJERCICIOS)
const missionData = [
    {a:3, b:4, c:5}, {a:6, b:8, c:10}, {a:5, b:12, c:13}, 
    {a:9, b:12, c:15}, {a:8, b:15, c:17}, {a:12, b:16, c:20},
    {a:7, b:24, c:25}, {a:20, b:21, c:29}, {a:10, b:24, c:26}, {a:15, b:20, c:25}
];

let currentLevel = 0;
const container = document.getElementById('game-container');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// 2. FUNCIÓN PARA CARGAR EL NIVEL (Aquí es donde se ponen los números)
function loadLevel() {
    const data = missionData[currentLevel];
    
    // Actualizar el número de ejercicio
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // MOSTRAR LOS NÚMEROS EN LAS CAJAS AMARILLAS (Esto era lo que faltaba)
    document.getElementById('val1').innerText = data.a;
    document.getElementById('val2').innerText = data.b;
    
    // Resetear etiquetas del triángulo
    document.getElementById('label-a').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('label-a').style.backgroundColor = "rgba(255,255,255,0.85)";
    document.getElementById('label-b').style.backgroundColor = "rgba(255,255,255,0.85)";
    
    // Ocultar panel de cálculos y limpiar inputs
    document.getElementById('step-panel').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { 
        i.value = ""; 
        i.style.borderColor = "#bdc3c7"; 
        i.classList.remove('input-error');
    });

    // Actualizar guía de texto
    document.getElementById('guide-text').innerText = "Glisse " + data.a + " et " + data.b + " sur le triangle.";
    
    // Limpiar el canvas de dibujo
    if(canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 3. SISTEMA DE ALERTAS (ERRORES)
function showError(msg) {
    document.getElementById('error-msg').innerText = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}

function closeError() {
    document.getElementById('error-modal').classList.add('hidden');
}

// 4. LÓGICA DE ARRASTRAR Y SOLTAR (DRAG & DROP)
document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.innerText);
    });
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
        e.preventDefault();
        const valor = e.dataTransfer.getData('text');
        t.innerText = valor;
        t.style.backgroundColor = "#d4efdf"; // Verde clarito al soltar
        
        checkIfBothDropped();
    });
});

function checkIfBothDropped() {
    const lA = document.getElementById('label-a').innerText;
    const lB = document.getElementById('label-b').innerText;
    if (lA !== '?' && lB !== '?') {
        document.getElementById('step-panel').classList.remove('hidden');
        document.getElementById('step-a2').focus();
    }
}

// 5. VALIDACIÓN DE CÁLCULOS PASO A PASO
const inputIds = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];

inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    
    // Detectar si olvidó elevar al cuadrado
    input.addEventListener('change', () => {
        const val = parseInt(input.value);
        const data = missionData[currentLevel];
        if ((id === 'step-a2' && val === data.a) || (id === 'step-b2' && val === data.b)) {
            showError("Attention Sergio ! Calcule le CARRÉ (Multiplie le nombre par lui-même)");
            input.value = ""; 
            input.classList.add('input-error');
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

// 6. CAMBIO DE NIVEL
function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) {
        loadLevel();
    } else {
        localStorage.setItem('mision1_completed', 'true');
        window.location.href = 'index.html'; // Regresa al menú
    }
}

// 7. LÓGICA DE LA CALCULADORA
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
        let res = Math.sqrt(eval(currentCalc.replace('×', '*').replace('÷', '/'))); 
        currentCalc = (Math.round(res * 100) / 100).toString(); 
        document.getElementById('calc-display').innerText = "√ = " + currentCalc; 
    } catch(e) { calcClear(); } 
}

// 8. INICIO AUTOMÁTICO
window.onload = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    loadLevel();
};
