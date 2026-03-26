const missionData = [
    {c:5, b:4, a:3}, {c:10, b:8, a:6}, {c:13, b:12, a:5},
    {c:15, b:12, a:9}, {c:17, b:15, a:8}, {c:20, b:16, a:12},
    {c:25, b:24, a:7}, {c:26, b:24, a:10}, {c:29, b:21, a:20}, {c:25, b:20, a:15}
];

let currentLevel = 0;
const container = document.getElementById('game-container');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    document.getElementById('val1').innerText = data.c;
    document.getElementById('val2').innerText = data.b;
    
    document.getElementById('label-c').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('label-c').style.backgroundColor = "rgba(255,255,255,0.85)";
    document.getElementById('label-b').style.backgroundColor = "rgba(255,255,255,0.85)";
    
    document.getElementById('step-panel').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { 
        i.value = ""; i.style.borderColor = "#bdc3c7"; i.classList.remove('input-error');
    });
}

function showError(msg) {
    document.getElementById('error-msg').innerText = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}

function closeError() { document.getElementById('error-modal').classList.add('hidden'); }

document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', e.target.innerText));
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
        e.preventDefault();
        const valor = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];

        // VALIDACIÓN CRÍTICA: La hipotenusa debe ir en label-c
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
            isCorrect = (val === data.a);
            msg = "La racine est incorrecte. Utilise la touche √ !";
        }

        if (isCorrect) {
            input.style.borderColor = "#2ecc71";
            input.classList.remove('input-error');
            if (id === 'step-sqrt') document.getElementById('bravo-modal').classList.remove('hidden');
            else document.getElementById(inputIds[idx + 1]).focus();
        } else {
            input.classList.add('input-error');
            showError(msg);
            input.value = "";
        }
    });
});

// Calculadora
let currentCalc = "";
function toggleCalc() { document.getElementById('mini-calc').classList.toggle('hidden'); }
function calcInput(n) { currentCalc += n; document.getElementById('calc-display').innerText = currentCalc; }
function calcOp(o) { currentCalc += " " + o + " "; document.getElementById('calc-display').innerText = currentCalc; }
function calcClear() { currentCalc = ""; document.getElementById('calc-display').innerText = "0"; }
function calcRes() { try { currentCalc = eval(currentCalc.replace('×', '*').replace('÷', '/')).toString(); document.getElementById('calc-display').innerText = currentCalc; } catch(e) { calcClear(); } }
function calcSqrt() { try { let v = eval(currentCalc.replace('×', '*').replace('÷', '/')); currentCalc = (Math.round(Math.sqrt(v) * 100) / 100).toString(); document.getElementById('calc-display').innerText = "√ = " + currentCalc; } catch(e) { calcClear(); } }

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) loadLevel();
    else { localStorage.setItem('mision2_completed', 'true'); window.location.href='index.html'; }
}

window.onload = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    loadLevel();
};
