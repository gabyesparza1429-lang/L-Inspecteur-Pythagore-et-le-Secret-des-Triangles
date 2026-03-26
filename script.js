let etape = 0;
const messages = [
    "1. Dessine le triangle sur la grille verte.",
    "2. Glisse le '3' dans le premier carré de la formule.",
    "3. Glisse le '4' dans le deuxième carré.",
    "4. Super ! Clique sur VÉRIFIER."
];

function prochaineEtape() {
    document.getElementById('instruction-text').innerText = messages[etape];
    if (etape === 1 || etape === 2) {
        document.querySelectorAll('.drop-target').forEach(t => t.classList.add('highlight'));
    }
    etape = (etape + 1) % messages.length;
}

// Lógica de dibujo simple
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 450; canvas.height = 300;
let drawing = false;

canvas.onmousedown = () => drawing = true;
canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
canvas.onmousemove = (e) => {
    if(!drawing) return;
    ctx.lineWidth = 5; ctx.strokeStyle = '#2ecc71';
    ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke();
};

// Drag and Drop
document.querySelectorAll('.draggable').forEach(d => {
    d.ondragstart = (e) => e.dataTransfer.setData('text', e.target.innerText);
});

document.querySelectorAll('.drop-target').forEach(t => {
    t.ondragover = (e) => e.preventDefault();
    t.ondrop = (e) => {
        t.innerText = e.dataTransfer.getData('text');
        t.classList.remove('highlight');
        document.getElementById('check-btn').classList.remove('hidden');
    };
});

function verifier() {
    alert("Bravo Sergio ! 3² + 4² = 9 + 16 = 25. La racine de 25 est 5 !");
}
