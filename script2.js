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
    // Mezclamos los valores para que Sergio identifique cuál es la hipotenusa
    document.getElementById('val-hypo').innerText = data.c;
    document.getElementById('val-cote').innerText = (data.a || data.b);
    
    document.getElementById('label-c').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('step-panel').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { i.value = ""; i.style.borderColor = "#bdc3c7"; });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Validación de pasos con resta
const inputIds = ['step-c2', 'step-a2', 'step-minus', 'step-sqrt'];
inputIds.forEach((id, idx) => {
    document.getElementById(id).addEventListener('input', function() {
        const val = parseInt(this.value);
        const data = missionData[currentLevel];
        let correct = false;
        const c2 = data.c ** 2;
        const b2 = (data.a || data.b) ** 2;

        if(id === 'step-c2') correct = (val === c2);
        if(id === 'step-a2') correct = (val === b2);
        if(id === 'step-minus') correct = (val === (c2 - b2));
        if(id === 'step-sqrt') correct = (val === (data.a && data.b ? (data.a === parseInt(document.getElementById('val-cote').innerText) ? data.b : data.a) : data.a || data.b)); 
        // Simplificado para Sergio: el resultado es el lado que faltaba
        if(id === 'step-sqrt') correct = (val**2 === (c2-b2));

        if(correct) {
            this.style.borderColor = "#2ecc71";
            if(id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
            } else {
                document.getElementById(inputIds[idx+1]).focus();
            }
        }
    });
});

// Drag and Drop
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        const val = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];
        
        // Regla de Sergio: La hipotenusa debe ir en el cuadro C
        if(t.id === 'label-c' && val !== data.c) {
            alert("Attention ! L'hypoténuse est le côté le plus long.");
            return;
        }
        
        t.innerText = val;
        if(document.getElementById('label-c').innerText !== '?' && document.getElementById('label-b').innerText !== '?') {
            document.getElementById('step-panel').classList.remove('hidden');
            document.getElementById('step-c2').focus();
        }
    };
});

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) loadLevel();
    else alert("INCROYABLE ! TU AS DÉCOUVERT TOUS LES CÔTÉS SECRETS !");
}

window.onload = () => {
    canvas.width = document.getElementById('game-container').clientWidth;
    canvas.height = document.getElementById('game-container').clientHeight;
    loadLevel();
};
