const missionData = [
    {a:6, b:8, c:10, isReal: true},   // 36+64=100 (VRAI)
    {a:3, b:4, c:6, isReal: false},   // 9+16=25 (NO ES 36, FAUX)
    {a:5, b:12, c:13, isReal: true},  // 25+144=169 (VRAI)
    {a:7, b:8, c:12, isReal: false},  // 49+64=113 (NO ES 144, FAUX)
    {a:8, b:15, c:17, isReal: true},  // 64+225=289 (VRAI)
    {a:10, b:10, c:15, isReal: false}, // 100+100=200 (NO ES 225, FAUX)
    {a:9, b:12, c:15, isReal: true},   // 81+144=225 (VRAI)
    {a:6, b:7, c:9, isReal: false},    // 36+49=85 (NO ES 81, FAUX)
    {a:20, b:21, c:29, isReal: true},  // 400+441=841 (VRAI)
    {a:10, b:24, c:26, isReal: true}   // 100+576=676 (VRAI)
];

let currentLevel = 0;

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // Mostramos los 3 números mezclados
    const nums = [data.a, data.b, data.c].sort(() => Math.random() - 0.5);
    document.getElementById('val1').innerText = nums[0];
    document.getElementById('val2').innerText = nums[1];
    document.getElementById('val3').innerText = nums[2];

    // Limpiar todo
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

// Arrastrar y soltar
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        e.preventDefault();
        const valor = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];
        const masGrande = Math.max(data.a, data.b, data.c);

        // SI intenta poner el pequeño en la hipotenusa: ¡ERROR!
        if (t.id === 'label-c' && valor !== masGrande) {
            showError("Attention ! Le plus grand nombre (" + masGrande + ") doit aller sur le côté le plus long.");
            return;
        }

        t.innerText = valor;
        t.style.backgroundColor = "#d4efdf";
        
        // Si ya puso los 3, abrimos los cálculos
        if ([...document.querySelectorAll('.drop-label')].every(l => l.innerText !== "?")) {
            document.getElementById('step-panel').classList.remove('hidden');
        }
    };
});

// Cuando Sergio escribe en los cuadros de cálculo
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
        const data = missionData[currentLevel];
        const valSum = parseInt(document.getElementById('step-sum').value);
        const valC2 = parseInt(document.getElementById('step-c2').value);

        // Si ya calculó ambos, dejamos que decida
        if (!isNaN(valSum) && !isNaN(valC2)) {
            document.getElementById('decision-zone').classList.remove('hidden');
        }
    });
});

function checkVerdict(userChoice) {
    const data = missionData[currentLevel];
    // La respuesta correcta es si la elección de Sergio coincide con la realidad (isReal)
    if (userChoice === data.isReal) {
        document.getElementById('bravo-modal').classList.remove('hidden');
    } else {
        showError("Le verdict est FAUX. Vérifie si a² + b² est vraiment ÉGAL à c² !");
    }
}

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if (currentLevel < 10) loadLevel();
    else {
        localStorage.setItem('mision3_completed', 'true');
        window.location.href = 'index.html';
    }
}

// Lógica de la calculadora (la misma de antes)
let currentCalc = "";
function toggleCalc() { document.getElementById('mini-calc').classList.toggle('hidden'); }
function calcInput(n) { currentCalc += n; document.getElementById('calc-display').innerText = currentCalc; }
function calcOp(o) { currentCalc += " " + o + " "; document.getElementById('calc-display').innerText = currentCalc; }
function calcClear() { currentCalc = ""; document.getElementById('calc-display').innerText = "0"; }
function calcRes() { try { currentCalc = eval(currentCalc.replace('×', '*').replace('÷', '/')).toString(); document.getElementById('calc-display').innerText = currentCalc; } catch(e) { calcClear(); } }
function calcSqrt() { try { let v = eval(currentCalc.replace('×', '*').replace('÷', '/')); currentCalc = Math.round(Math.sqrt(v)).toString(); document.getElementById('calc-display').innerText = currentCalc; } catch(e) { calcClear(); } }

window.onload = loadLevel;
