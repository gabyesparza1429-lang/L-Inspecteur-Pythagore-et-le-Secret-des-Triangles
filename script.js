let currentStep = 1;
const ejercicios = [
    { a: 3, b: 4, c: 5 },
    { a: 6, b: 8, c: 10 }
];
let exIndex = 0;

const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800; canvas.height = 450;

// --- DIBUJO ---
let drawing = false;
canvas.onmousedown = () => drawing = true;
window.onmouseup = () => { drawing = false; ctx.beginPath(); };
canvas.onmousemove = (e) => {
    if(!drawing) return;
    ctx.lineWidth = 4; ctx.strokeStyle = '#2ecc71';
    ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke();
};

// --- DRAG & DROP ---
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        t.innerText = e.dataTransfer.getData('text');
        t.style.background = "#d4efdf";
        checkLabels();
    };
});

function checkLabels() {
    const lA = document.getElementById('label-a').innerText;
    const lB = document.getElementById('label-b').innerText;
    if (lA !== '?' && lB !== '?') {
        document.getElementById('step-panel').classList.remove('hidden');
    }
}

// --- VERIFICACIÓN PASO A PASO ---
function checkCalculs() {
    const ex = ejercicios[exIndex];
    const a2 = parseInt(document.getElementById('step-a2').value);
    const b2 = parseInt(document.getElementById('step-b2').value);
    const sum = parseInt(document.getElementById('step-sum').value);
    const res = parseInt(document.getElementById('step-sqrt').value);

    if (a2 === ex.a*ex.a && b2 === ex.b*ex.b && sum === (a2+b2) && res === ex.c) {
        alert("¡Excelente trabajo Sergio! ¡Misión cumplida!");
        exIndex++;
        if (exIndex < ejercicios.length) {
            proximoEjercicio();
        } else {
            alert("¡Has terminado todos los niveles de la Misión 1!");
        }
    } else {
        alert("Algo no cuadra... ¡Revisa tus multiplicaciones!");
    }
}

function proximoEjercicio() {
    const ex = ejercicios[exIndex];
    // Resetear visualmente
    document.getElementById('label-a').innerText = '?';
    document.getElementById('label-b').innerText = '?';
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('val1').innerText = ex.a;
    document.getElementById('val2').innerText = ex.b;
    ctx.clearRect(0,0,800,450);
}
