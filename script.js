const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');

// 10 Ejercicios con Raíces Exactas
const missionData = [
    {a:3, b:4, c:5}, {a:6, b:8, c:10}, {a:5, b:12, c:13}, 
    {a:9, b:12, c:15}, {a:8, b:15, c:17}, {a:12, b:16, c:20},
    {a:7, b:24, c:25}, {a:20, b:21, c:29}, {a:10, b:24, c:26}, {a:15, b:20, c:25}
];

let currentLevel = 0;

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    document.getElementById('val1').innerText = data.a;
    document.getElementById('val2').innerText = data.b;
    document.getElementById('guide-text').innerText = "1. Glisse les mesures sur le triangle.";
    
    // Reset inputs y labels
    document.getElementById('label-a').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('step-panel').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => { i.value = ""; i.style.borderColor = "#bdc3c7"; });
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

// Lógica de validación automática mientras escribe
const inputs = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];
inputs.forEach((id, idx) => {
    document.getElementById(id).addEventListener('input', function() {
        const val = parseInt(this.value);
        const data = missionData[currentLevel];
        let correct = false;

        if(id === 'step-a2') correct = (val === data.a * data.a);
        if(id === 'step-b2') correct = (val === data.b * data.b);
        if(id === 'step-sum') correct = (val === (data.a**2 + data.b**2));
        if(id === 'step-sqrt') correct = (val === data.c);

        if(correct) {
            this.style.borderColor = "#2ecc71";
            if(id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
            } else if(idx < inputs.length - 1) {
                document.getElementById(inputs[idx+1]).focus();
            }
        }
    });
});

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) {
        loadLevel();
    } else {
        alert("FÉLICITATIONS ! Tu as terminé la mission 1. Prêt pour la mission 2 ?");
    }
}

// --- DRAG AND DROP ---
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        t.innerText = e.dataTransfer.getData('text');
        if(document.getElementById('label-a').innerText !== '?' && document.getElementById('label-b').innerText !== '?') {
            document.getElementById('step-panel').classList.remove('hidden');
            document.getElementById('guide-text').innerText = "2. Complète les carrés et la racine.";
            document.getElementById('step-a2').focus();
        }
    };
});

// Inicializar
window.onload = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    loadLevel();
};

// (Incluir aquí el código de dibujo con mouse/touch de los mensajes anteriores)
