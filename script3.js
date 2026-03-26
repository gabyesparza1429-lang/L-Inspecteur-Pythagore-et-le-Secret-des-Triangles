// 1. DATOS DE LA MISIÓN 3
const missionData = [
    {a:6, b:8, c:10, isReal: true},   
    {a:3, b:4, c:6, isReal: false},   
    {a:5, b:12, c:13, isReal: true},  
    {a:7, b:8, c:12, isReal: false},  
    {a:8, b:15, c:17, isReal: true},  
    {a:10, b:10, c:15, isReal: false}, 
    {a:9, b:12, c:15, isReal: true},   
    {a:6, b:7, c:9, isReal: false},    
    {a:20, b:21, c:29, isReal: true},  
    {a:10, b:24, c:26, isReal: true}   
];

let currentLevel = 0;
const container = document.getElementById('game-container');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// 2. FUNCIÓN DE DIBUJO (MÁGICA)
function drawTriangle() {
    // Aseguramos que el canvas tenga el tamaño correcto del contenedor
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    const data = missionData[currentLevel];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Definimos los puntos del triángulo (proporcionales al tamaño de la pantalla)
    const startX = canvas.width * 0.3; // Punto A
    const startY = canvas.height * 0.7; // Punto A
    const baseWidth = canvas.width * 0.35; // Escala de la base
    const heightFactor = 0.8; // Para que no sea muy alto

    // Calculamos los puntos
    const pointC = { x: startX + baseWidth, y: startY }; // C (Cateto b)
    const pointB = { x: startX, y: startY - (baseWidth * heightFactor) }; // B (Cateto a)
    const pointA = { x: startX, y: startY }; // Ángulo recto

    // Dibujamos el triángulo
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y); // Empezamos en A
    ctx.lineTo(pointC.x, pointC.y); // Línea a C (base)
    ctx.lineTo(pointB.x, pointB.y); // Línea a B (hipotenusa)
    ctx.closePath(); // Cerramos a A

    // Estilo de línea (Morado de la misión 3)
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#9b59b6';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dibujamos el símbolo de ángulo recto
    const rectSize = 15;
    ctx.beginPath();
    ctx.moveTo(pointA.x + rectSize, pointA.y);
    ctx.lineTo(pointA.x + rectSize, pointA.y - rectSize);
    ctx.lineTo(pointA.x, pointA.y - rectSize);
    ctx.lineWidth = 3;
    ctx.stroke();

    // POSICIONAMOS LAS ETIQUETAS (drop-labels) sobre el dibujo
    const la = document.getElementById('label-a');
    la.style.left = (pointA.x - 30) + 'px'; // A la izquierda de la línea vertical
    la.style.top = (pointB.y + (startY - pointB.y)/2 - 30) + 'px'; // Mitad de la línea vertical

    const lb = document.getElementById('label-b');
    lb.style.left = (startX + baseWidth/2 - 30) + 'px'; // Mitad de la base
    lb.style.top = (pointA.y + 10) + 'px'; // Debajo de la base

    const lc = document.getElementById('label-c');
    lc.style.left = (pointC.x - (pointC.x - pointB.x)/2 - 30) + 'px'; // Mitad de la diagonal
    lc.style.top = (pointC.y - (pointC.y - pointB.y)/2 - 50) + 'px'; // Arriba de la diagonal
}

// 3. CARGAR NIVEL
function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // Mezclar los 3 números para el inventario
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

    // Dibujamos el triángulo del nivel
    drawTriangle();
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
        e.preventDefault();
        const val = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];
        const masGrande = Math.max(data.a, data.b, data.c);

        if (t.id === 'label-c' && val !== masGrande) {
            showError("Attention Sergio ! Le plus grand nombre (" + masGrande + ") doit aller sur l'hypoténuse (le côté le plus long).");
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

        if (!isNaN(sum) && !isNaN(c2)) {
            document.getElementById('decision-zone').classList.remove('hidden');
        }
    });
});

function checkVerdict(userChoice) {
    if(userChoice === missionData[currentLevel].isReal) {
        document.getElementById('bravo-modal').classList.remove('hidden');
    } else {
        showError("Le verdict est FAUX. Vérifie bien si a² + b² est ÉGAL à c².");
    }
}

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) loadLevel();
    else { localStorage.setItem('mision3_completed', 'true'); window.location.href='index.html'; }
}

// Lógica de la calculadora
let currentCalc = "";
function toggleCalc() { document.getElementById('mini-calc').classList.toggle('hidden'); }
function calcInput(n) { currentCalc += n; document.getElementById('calc-display').innerText = currentCalc; }
function calcOp(o) { currentCalc += " " + o + " "; document.getElementById('calc-display').innerText = currentCalc; }
function calcClear() { currentCalc = ""; document.getElementById('calc-display').innerText = "0"; }
function calcRes() { try { currentCalc = eval(currentCalc.replace('×', '*').replace('÷', '/')).toString(); document.getElementById('calc-display').innerText = currentCalc; } catch(e) { calcClear(); } }
function calcSqrt() { try { let v = eval(currentCalc.replace('×', '*').replace('÷', '/')); currentCalc = Math.round(Math.sqrt(v)).toString(); document.getElementById('calc-display').innerText = "√ = " + currentCalc; } catch(e) { calcClear(); } }

// DIBUJO AL CARGAR
window.onload = loadLevel;

// Si se cambia el tamaño de la ventana, redibujamos
window.onresize = drawTriangle;
