let etapaActual = "arrastrar";
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');

// Datos del ejercicio actual (podemos cambiarlos para el siguiente ejercicio)
let currentEx = { a: 3, b: 4, c: 5 };

// --- DRAG AND DROP ---
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        const val = e.dataTransfer.getData('text');
        t.innerText = val;
        t.style.border = "2px solid #2ecc71";
        checkLabels();
    };
});

function checkLabels() {
    const lA = document.getElementById('label-a').innerText;
    const lB = document.getElementById('label-b').innerText;
    
    if (lA !== '?' && lB !== '?') {
        document.getElementById('step-panel').classList.remove('hidden');
        document.getElementById('guide-text').innerText = "Étape 2: Complète les calculs à droite.";
        etapaActual = "calcular";
    }
}

// --- LÓGICA DE CÁLCULOS PASO A PASO ---
function checkCalculs() {
    const a2 = parseInt(document.getElementById('step-a2').value);
    const b2 = parseInt(document.getElementById('step-b2').value);
    const sum = parseInt(document.getElementById('step-sum').value);
    const res = parseInt(document.getElementById('step-sqrt').value);

    // Validación paso a paso para Sergio
    if (a2 !== currentEx.a * currentEx.a) {
        alert("Vérifie le premier carré (a²)");
        return;
    }
    if (b2 !== currentEx.b * currentEx.b) {
        alert("Vérifie le deuxième carré (b²)");
        return;
    }
    if (sum !== (a2 + b2)) {
        alert("Vérifie l'addition des deux carrés");
        return;
    }
    if (res !== currentEx.c) {
        alert("Quelle est la racine carrée de " + sum + " ?");
        return;
    }

    alert("BRAVO SERGIO ! Tu as trouvé l'hypoténuse : " + res);
    nextExercise();
}

function darPista() {
    if (etapaActual === "arrastrar") {
        alert("Glisse les nombres 3 et 4 sur les côtés du triangle.");
    } else {
        alert("Calcule le carré de chaque nombre (nombres x lui-même).");
    }
}

// Para añadir más ejercicios después
function nextExercise() {
    // Aquí cambiaremos currentEx a {a: 6, b: 8, c: 10} por ejemplo
    alert("Passons à l'exercice suivant...");
    location.reload(); // Por ahora reinicia, pero podemos hacerlo fluido
}

// (Mantén aquí el código de dibujo del canvas anterior)
