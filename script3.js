const missionData = [
    {a:6, b:8, c:10, real: true},   // Correcto
    {a:3, b:4, c:6, real: false},   // Falso (9+16=25, no 36)
    {a:5, b:12, c:13, real: true},  // Correcto
    {a:5, b:5, c:8, real: false},   // Falso
    {a:9, b:12, c:15, real: true},  // Correcto
    {a:7, b:8, c:12, real: false},  // Falso
    {a:8, b:15, c:17, real: true},  // Correcto
    {a:10, b:10, c:15, real: false},// Falso
    {a:20, b:21, c:29, real: true}, // Correcto
    {a:6, b:6, c:10, real: false}   // Falso
];

let currentLevel = 0;

function loadLevel() {
    const data = missionData[currentLevel];
    document.getElementById('current-ex').innerText = currentLevel + 1;
    
    // Mostramos los 3 números mezclados
    const nums = [data.a, data.b, data.c].sort((x, y) => Math.random() - 0.5);
    document.getElementById('val1').innerText = nums[0];
    document.getElementById('val2').innerText = nums[1];
    document.getElementById('val3').innerText = nums[2];

    document.querySelectorAll('.drop-label').forEach(l => l.innerText = "?");
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('decision-zone').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => i.value = "");
}

// Drag & Drop
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-label').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        const val = parseInt(e.dataTransfer.getData('text'));
        const data = missionData[currentLevel];
        
        // Regla: Sergio debe poner el más grande en label-c
        if(t.id === 'label-c' && val !== Math.max(data.a, data.b, data.c)) {
            alert("Rappel: L'hypoténuse est toujours le plus grand nombre !");
            return;
        }
        t.innerText = val;
        
        if([...document.querySelectorAll('.drop-label')].every(l => l.innerText !== "?")) {
            document.getElementById('step-panel').classList.remove('hidden');
        }
    };
});

// Validación de cálculos
document.getElementById('step-c2').addEventListener('input', checkCalculs);
document.getElementById('step-sum').addEventListener('input', checkCalculs);

function checkCalculs() {
    const data = missionData[currentLevel];
    const sum = parseInt(document.getElementById('step-sum').value);
    const c2 = parseInt(document.getElementById('step-c2').value);
    
    if(sum === (data.a**2 + data.b**2) && c2 === (data.c**2)) {
        document.getElementById('decision-zone').classList.remove('hidden');
    }
}

function verdict(isVrai) {
    const data = missionData[currentLevel];
    if(isVrai === data.real) {
        document.getElementById('bravo-modal').classList.remove('hidden');
    } else {
        alert("Oups! Regarde bien si les deux nombres sont égaux.");
    }
}

function nextLevel() {
    document.getElementById('bravo-modal').classList.add('hidden');
    currentLevel++;
    if(currentLevel < 10) loadLevel();
    else {
        localStorage.setItem('mision3_completed', 'true');
        alert("MISSION 3 RÉUSSIE ! TU ES UN EXPERT !");
        window.location.href = 'index.html';
    }
}

window.onload = loadLevel;
