const missionData = [
    {a:6, b:8, c:10, isReal: true},  {a:3, b:4, c:6, isReal: false},
    {a:5, b:12, c:13, isReal: true}, {a:5, b:5, c:8, isReal: false},
    {a:9, b:12, c:15, isReal: true}, {a:7, b:8, c:12, isReal: false},
    {a:8, b:15, c:17, isReal: true}, {a:10, b:10, c:15, isReal: false},
    {a:20, b:21, c:29, isReal: true}, {a:6, b:6, c:10, isReal: false}
];

let currentLevel = 0;

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // Mezclar los 3 números para que Sergio identifique la hipotenusa solo
    const nums = [data.a, data.b, data.c].sort(() => Math.random() - 0.5);
    document.getElementById('val1').innerText = nums[0];
    document.getElementById('val2').innerText = nums[1];
    document.getElementById('val3').innerText = nums[2];

    document.querySelectorAll('.drop-label').forEach(l => {
        l.innerText = "?"; l.style.backgroundColor = "rgba(255,255,255,0.85)";
    });
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('decision-zone').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { i.value = ""; i.style.borderColor = "#bdc3c7"; });
}

function showError(msg) {
    document.getElementById('error-msg').innerText = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}
function closeError() { document.getElementById('error-modal').classList.add('hidden'); }

// Drag & Drop
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        const val = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];
        const max = Math.max(data.a, data.b, data.c);

        if(t.id === 'label-c' && val !== max) {
            showError("Attention Sergio ! L'hypoténuse est TOUJOURS le plus grand nombre (" + max + ") !");
            return;
        }
        t.innerText = val;
        t.style.backgroundColor = "#d4efdf";
        if([...document.querySelectorAll('.drop-label')].every(l => l.innerText !== "?")) {
            document.getElementById('step-panel').classList.remove('hidden');
        }
    };
});

// Validación de cálculos
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
        const val = parseInt(input.value);
        if (isNaN(val)) return;
        const data = missionData[currentLevel];
        const sum = parseInt(document.getElementById('step-sum').value);
        const c2 = parseInt(document.getElementById('step-c2').value);

        if (sum === (data.a**2 + data.b**2) && c2 === (data.c**2)) {
            document.getElementById('decision-zone').classList.remove('hidden');
        } else {
            showError("Les calculs sont incorrects. Vérifie bien les carrés !");
            input.value = "";
        }
    });
});

function checkVerdict(userChoice) {
    if(userChoice === missionData[currentLevel].isReal) {
        document.getElementById('bravo-modal').classList.remove('hidden');
    } else {
        showError("Le verdict est faux ! Regarde bien si la somme est égale au carré de l'hypoténuse.");
    }
}

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) loadLevel();
    else { localStorage.setItem('mision3_completed', 'true'); window.location.href='index.html'; }
}

// Calculadora
let currentCalc = "";
function toggleCalc() { document.getElementById('mini-calc').classList.toggle('hidden'); }
function calcInput(n) { currentCalc += n; document.getElementById('calc-display').innerText = currentCalc; }
function calcOp(o) { currentCalc += " " + o + " "; document.getElementById('calc-display').innerText = currentCalc; }
function calcClear() { currentCalc = ""; document.getElementById('calc-display').innerText = "0"; }
function calcRes() { try { currentCalc = eval(currentCalc.replace('×', '*').replace('÷', '/')).toString(); document.getElementById('calc-display').innerText = currentCalc; } catch(e) { calcClear(); } }
function calcSqrt() { try { let v = eval(currentCalc.replace('×', '*').replace('÷', '/')); currentCalc = Math.round(Math.sqrt(v)).toString(); document.getElementById('calc-display').innerText = "√ = " + currentCalc; } catch(e) { calcClear(); } }

window.onload = loadLevel;
