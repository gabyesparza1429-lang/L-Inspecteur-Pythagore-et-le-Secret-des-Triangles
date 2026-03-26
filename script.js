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
    
    // Reset visual
    document.getElementById('label-a').innerText = "?";
    document.getElementById('label-b').innerText = "?";
    document.getElementById('step-panel').classList.add('hidden');
    document.getElementById('guide-text').innerText = "Glisse " + data.a + " et " + data.b + " sur le triangle.";
    
    document.querySelectorAll('input').forEach(input => {
        input.value = "";
        input.style.borderColor = "#bdc3c7";
        input.style.backgroundColor = "white";
    });
}

// Lógica de validación con auto-salto
const inputIds = ['step-a2', 'step-b2', 'step-sum', 'step-sqrt'];
inputIds.forEach((id, idx) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
        const val = parseInt(input.value);
        const data = missionData[currentLevel];
        let correct = false;

        if(id === 'step-a2') correct = (val === data.a ** 2);
        if(id === 'step-b2') correct = (val === data.b ** 2);
        if(id === 'step-sum') correct = (val === (data.a**2 + data.b**2));
        if(id === 'step-sqrt') correct = (val === data.c);

        if(correct) {
            input.style.borderColor = "#2ecc71";
            input.style.backgroundColor = "#e8f8f5";
            if(id === 'step-sqrt') {
                document.getElementById('bravo-modal').classList.remove('hidden');
            } else {
                document.getElementById(inputIds[idx + 1]).focus();
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
        alert("FÉLICITATIONS ! Mission 1 terminée !");
    }
}

// Inicialización al cargar
window.onload = () => {
    loadLevel();
};
