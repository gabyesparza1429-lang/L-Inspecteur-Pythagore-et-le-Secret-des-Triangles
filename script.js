// ... (Mantén la lógica de dibujo y drag & drop del mensaje anterior) ...

// Datos de los ejercicios
const ejercicios = [
    { a: 3, b: 4, c: 5 },
    { a: 6, b: 8, c: 10 },
    { a: 5, b: 12, c: 13 }
];
let exIndex = 0;

// Función para verificar cálculos mientras escribe (más rápido)
const inputs = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];

inputs.forEach((id, index) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
        const val = parseInt(el.value);
        const ex = ejercicios[exIndex];
        
        // Valores correctos según el paso
        let correct = false;
        if (id === 'step-a2') correct = (val === ex.a * ex.a);
        if (id === 'step-b2') correct = (val === ex.b * ex.b);
        if (id === 'step-sum') correct = (val === (ex.a*ex.a + ex.b*ex.b));
        if (id === 'step-sqrt') correct = (val === ex.c);

        if (correct) {
            el.classList.add('correct-input');
            // Auto-foco al siguiente cuadro
            if (index < inputs.length - 1) {
                document.getElementById(inputs[index + 1]).focus();
            }
        } else {
            el.classList.remove('correct-input');
        }
    });
});

function checkCalculs() {
    const res = parseInt(document.getElementById('step-sqrt').value);
    const ex = ejercicios[exIndex];

    if (res === ex.c) {
        alert("BRAVO SERGIO! " + ex.a + "² + " + ex.b + "² = " + (ex.c*ex.c) + ". √" + (ex.c*ex.c) + " = " + ex.c);
        exIndex++;
        if (exIndex < ejercicios.length) {
            proximoEjercicio();
        } else {
            alert("TU ES UN EXPERT EN PYTHAGORE!");
        }
    } else {
        alert("Oups! Vérifie tes calculs.");
    }
}

function proximoEjercicio() {
    const ex = ejercicios[exIndex];
    // Resetear todo
    document.getElementById('label-a').innerText = '?';
    document.getElementById('label-b').innerText = '?';
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('val1').innerText = ex.a;
    document.getElementById('val2').innerText = ex.b;
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.classList.remove('correct-input');
    });
    // Limpiar canvas
    const canvas = document.getElementById('drawing-canvas');
    canvas.getContext('2d').clearRect(0,0,800,450);
}
