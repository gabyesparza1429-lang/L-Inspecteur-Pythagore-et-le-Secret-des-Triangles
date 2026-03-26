// 1. BASE DE DATOS DE LA MISIÓN 1
const missionData = [
    {a:3, b:4, c:5}, {a:6, b:8, c:10}, {a:5, b:12, c:13}, 
    {a:9, b:12, c:15}, {a:8, b:15, c:17}, {a:12, b:16, c:20},
    {a:7, b:24, c:25}, {a:20, b:21, c:29}, {a:10, b:24, c:26}, {a:15, b:20, c:25}
];

let currentLevel = 0;
const container = document.getElementById('game-container');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// 2. FUNCIÓN CARGAR NIVEL
function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // Pinta los números en las cajas amarillas del inventario
    document.getElementById('val1').innerText = data.a;
    document.getElementById('val2').innerText = data.b;
    
    // Reset de etiquetas en el triángulo
    document.getElementById('label-a').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('label-a').style.backgroundColor = "rgba(255,255,255,0.85)";
    document.getElementById('label-b').style.backgroundColor = "rgba(255,255,255,0.85)";
    
    // Reset de inputs y paneles
    document.getElementById('step-panel').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { 
        i.value = ""; 
        i.style.borderColor = "#bdc3c7"; 
        i.classList.remove('input-error');
    });

    document.getElementById('guide-text').innerText = "Glisse " + data.a + " et " + data.b + " sur le triangle.";
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
        t.innerText = e.dataTransfer.getData('text');
        t.style.backgroundColor = "#d4efdf";
        
        if (document.getElementById('label-a').innerText !== '?' && document.getElementById('label-b').innerText !== '?') {
            document.getElementById('step-panel').classList.remove('hidden');
            document.getElementById('step-a2').focus();
        }
    });
});

// 5. VALIDACIÓN PASO A PASO (CON ERROR EN RAÍZ)
const inputIds = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];

inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    
    // Usamos 'change' para validar cuando Sergio termina de escribir
    input.addEventListener('change', () => {
        const val = parseInt(input.value);
        if (isNaN(val)) return;

        const data = missionData[currentLevel];
        let isCorrect = false;
        let msg = "";

        if (id === 'step-a2') {
            isCorrect = (val === data.a ** 2);
            msg = (val === data.a) ? "Attention Sergio ! Calcule le CARRÉ (" + data.a + " x " + data.a + ")" : "Le carré est incorrect.";
        } else if (id === 'step-b2') {
            isCorrect = (val === data.b ** 2);
            msg = (val === data.b) ? "N'oublie pas le CARRÉ de " + data.b : "Le carré est incorrect.";
        } else if (id === 'step-sum') {
            isCorrect = (val === (data.a**2 + data.b**2));
            msg = "L'addition est fausse, Sergio !";
        } else if (id === 'step-sqrt') {
            isCorrect = (val === data.c);
            msg = "La racine carrée n'est pas correcte. Utilise la touche √ !";
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

// 6. LÓGICA DE LA CALCULADORA
let currentCalc = "";
function toggleCalc() { document.getElementById('mini-calc').classList.toggle('hidden'); }
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
        localStorage.setItem('mision1_completed', 'true'); 
        window.location.href='index.html'; 
    }
}

// 8. AJUSTE DE CANVAS E INICIO
window.onload = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    loadLevel();
};
