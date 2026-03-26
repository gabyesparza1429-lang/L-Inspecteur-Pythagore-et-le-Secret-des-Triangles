const missionData = [
    {c:5, b:4, a:3}, {c:10, a:6, b:8}, {c:13, b:12, a:5},
    {c:15, a:9, b:12}, {c:17, b:15, a:8}, {c:20, a:12, b:16},
    {c:25, b:24, a:7}, {c:26, a:10, b:24}, {c:29, b:21, a:20}, {c:25, a:15, b:20}
];

let currentLevel = 0;
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // CORRECCIÓN: Aquí ponemos los números en las cajas amarillas (val1 y val2)
    document.getElementById('val1').innerText = data.c;
    document.getElementById('val2').innerText = (data.a || data.b);
    
    // Resetear etiquetas del triángulo
    document.getElementById('label-c').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('label-c').style.backgroundColor = "rgba(255,255,255,0.8)";
    document.getElementById('label-b').style.backgroundColor = "rgba(255,255,255,0.8)";
    
    // Ocultar panel de cálculos hasta que arrastre los números
    document.getElementById('step-panel').classList.add('hidden');
    
    // Limpiar inputs
    document.querySelectorAll('input').forEach(i => { 
        i.value = ""; 
        i.style.borderColor = "#bdc3c7"; 
        i.classList.remove('input-error');
    });
    
    // Limpiar dibujo
    if(canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Control de Modales (Mantenemos lo que te gustó)
function showError(msg) {
    document.getElementById('error-msg').innerText = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}
function closeError() { document.getElementById('error-modal').classList.add('hidden'); }

// Drag & Drop con validación de hipotenusa
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        const val = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];
        
        // Error si intenta poner el cateto en la hipotenusa
        if(t.id === 'label-c' && val !== data.c) {
            showError("Attention Sergio ! L'hypoténuse est le côté le plus long (" + data.c + "). Elle doit aller sur le côté diagonal.");
            return;
        }
        
        t.innerText = val;
        t.style.backgroundColor = "#d4efdf";
        
        if(document.getElementById('label-c').innerText !== '?' && document.getElementById('label-b').innerText !== '?') {
            document.getElementById('step-panel').classList.remove('hidden');
        }
    };
});

// Validación de Teclado (Detecta si olvidó el cuadrado)
const inputIds = ['step-c2', 'step-a2', 'step-minus', 'step-sqrt'];
inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    
    input.addEventListener('change', () => {
        const val = parseInt(input.value);
        const data = missionData[currentLevel];
        if(id === 'step-c2' && val === data.c) {
            showError("Attention Sergio ! Ici c'est le CARRÉ (c²). Tu dois multiplier " + data.c + " x " + data.c);
            input.value = ""; input.classList.add('input-error'); return;
        }
        const lado = (data.a || data.b);
        if(id === 'step-a2' && val === lado) {
            showError("N'oublie pas le CARRÉ ! Multiplie " + lado + " x " + lado);
            input.value = ""; input.classList.add('input-error'); return;
        }
    });

    input.addEventListener('input', () => {
        const val = parseInt(input.value);
        const data = missionData[currentLevel];
        let correct = false;
        const c2 = data.c ** 2;
        const b2 = (data.a || data.b) ** 2;

        if(id === 'step-c2') correct = (val === c2);
        if(id === 'step-a2') correct = (val === b2);
        if(id === 'step-minus') correct = (val === (c2 - b2));
        if(id === 'step-sqrt') {
            // El resultado es el lado que NO arrastró (la incógnita)
            const incognita = (data.a === parseInt(document.getElementById('label-b').innerText)) ? data.b : data.a;
            if (val === data.a || val === data.b) correct = (val**2 === (c2 - b2));
        }

        if(correct) {
            input.style.borderColor = "#2ecc71";
            input.classList.remove('input-error');
            if(id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
                // Guardar progreso para el menú
                localStorage.setItem('mision2_completed', 'true');
            } else {
                document.getElementById(inputIds[idx+1]).focus();
            }
        }
    });
});

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) loadLevel();
    else {
        alert("FÉLICITATIONS SERGIO ! TU AS FINI LA MISSION 2 !");
        window.location.href = 'index.html'; // Volver al menú
    }
}

window.onload = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    loadLevel();
};
