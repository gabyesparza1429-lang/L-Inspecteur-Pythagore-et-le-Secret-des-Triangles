// --- CONFIGURACIÓN DE AUDIO ---
const playSnd = (id) => {
    const s = document.getElementById(id);
    s.currentTime = 0;
    s.play();
};

// --- LÓGICA DE DIBUJO (Canvas) ---
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 450;
canvas.height = 300;

let isDrawing = false;

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2ecc71'; // Verde llamativo

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
});

// --- LÓGICA DRAG & DROP ---
const draggables = document.querySelectorAll('.draggable');
const targets = document.querySelectorAll('.drop-target');
const checkBtn = document.getElementById('check-btn');

draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('val', item.dataset.value);
        e.dataTransfer.setData('id', item.id);
    });
});

targets.forEach(target => {
    target.addEventListener('dragover', (e) => e.preventDefault());
    
    target.addEventListener('drop', (e) => {
        e.preventDefault();
        const value = e.dataTransfer.getData('val');
        const originalId = e.dataTransfer.getData('id');
        
        // Efecto visual y sonoro
        target.innerText = value;
        target.style.border = "3px solid #2ecc71";
        target.style.background = "#e8f8f5";
        playSnd('snd-drop');

        validarProgreso();
    });
});

function validarProgreso() {
    const filled = Array.from(targets).every(t => t.innerText !== '?');
    if (filled) {
        checkBtn.classList.remove('hidden');
    }
}

// --- VALIDACIÓN FINAL ---
checkBtn.addEventListener('click', () => {
    const a = parseInt(document.getElementById('target-a').innerText);
    const b = parseInt(document.getElementById('target-b').innerText);
    
    // Verificamos si los valores coinciden con la lógica (3 y 4 o viceversa)
    if ((a === 3 && b === 4) || (a === 4 && b === 3)) {
        playSnd('snd-success');
        document.getElementById('result-box').innerHTML = "<b>5!</b>";
        document.getElementById('result-box').style.background = "#2ecc71";
        alert("Bravo Inspecteur ! 3² + 4² = 9 + 16 = 25. √25 = 5 !");
        // Aquí podrías redirigir a la Misión 2
    } else {
        playSnd('snd-error');
        alert("Oups... vérifie les valeurs sur les côtés !");
    }
});
