const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (diagonale), la base est à 3m. Trouve la hauteur !", a: "3m", b: "?", c: "5m", res: 4 },
    { title: "L'Arbre", desc: "Arbre de 10m, pointe au sol à 6m. Quelle est la hauteur du tronc?", a: "?", b: "6m", c: "10m", res: 8 }
];

let nivel = 0;
let canDraw = false;
let painting = false;
let startX, startY;
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetLevel();
}

function resetLevel() {
    document.getElementById('num-ex').innerText = nivel + 1;
    document.getElementById('title-mission').innerText = misiones[nivel].title;
    document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour voir l'énoncé.";
    document.getElementById('calc-modal').classList.add('hidden');
    document.querySelectorAll('.measure-tag').forEach(t => t.style.display = "none");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Bloquear pasos
    document.getElementById('s2').classList.add('locked');
    document.getElementById('s3').classList.add('locked');
}

function doStep(s) {
    document.querySelectorAll('.step-box').forEach(b => b.classList.remove('active'));
    document.getElementById('s' + s).classList.add('active');

    if (s === 1) { // LEER
        document.getElementById('problem-desc').innerText = misiones[nivel].desc;
        document.getElementById('s2').classList.remove('locked');
    }
}

function enableDrawing() {
    if(document.getElementById('s2').classList.contains('locked')) return;
    canDraw = true;
    document.getElementById('btn-pencil').style.background = "#39FF14";
    document.getElementById('instruction-footer').innerText = "Sergio, dessine maintenant le triangle sur le plan !";
}

canvas.onmousedown = (e) => {
    if(!canDraw) return;
    painting = true;
    startX = e.offsetX; startY = e.offsetY;
};

canvas.onmousemove = (e) => {
    if (!painting) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 6; ctx.shadowBlur = 15; ctx.shadowColor = '#39FF14';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY); // Sergio traza la hipotenusa
    ctx.stroke();
};

canvas.onmouseup = (e) => {
    if(!painting) return;
    painting = false;
    showPistas(e.offsetX, e.offsetY);
    document.getElementById('s3').classList.remove('locked');
};

function showPistas(ex, ey) {
    const tA = document.getElementById('tag-a');
    const tB = document.getElementById('tag-b');
    const tC = document.getElementById('tag-c');

    tA.innerText = "a = " + misiones[nivel].a;
    tA.style.left = startX - 80 + "px"; tA.style.top = startY + "px";
    tA.style.display = "block";

    tB.innerText = "b = " + misiones[nivel].b;
    tB.style.left = startX + 50 + "px"; tB.style.top = startY + 50 + "px";
    tB.style.display = "block";

    tC.innerText = "c = " + misiones[nivel].c;
    tC.style.left = ex + 20 + "px"; tC.style.top = ey - 20 + "px";
    tC.style.display = "block";

    document.getElementById('calc-modal').classList.remove('hidden');
    document.getElementById('instruction-footer').innerText = "Super ! Maintenant utilise la calculatrice.";
}

// Calculadora
let val = "";
function press(n) { val += n; document.getElementById('calc-screen').innerText = val; }
function cls() { val = ""; document.getElementById('calc-screen').innerText = "0"; }
function solve() { try { val = eval(val).toString(); document.getElementById('calc-screen').innerText = val; } catch(e) { cls(); } }
function solveSqrt() { val = Math.sqrt(eval(val)).toFixed(0); document.getElementById('calc-screen').innerText = val; }

function verify() {
    const r = parseInt(document.getElementById('calc-screen').innerText);
    if(r === misiones[nivel].res) {
        showMsg("🏆 BIEN JOUÉ !", "Tu as modélisé la situation comme un expert.", "#55efc4", true);
    } else {
        showMsg("⚠️ OUPS, SERGIO", "Regarde bien tes mesures et réessaie !", "#ff7675", false);
    }
}

function showMsg(t, txt, col, win) {
    document.getElementById('msg-title').innerText = t;
    document.getElementById('msg-text').innerText = txt;
    document.getElementById('msg-box').style.borderColor = col;
    document.getElementById('msg-overlay').classList.remove('hidden');
    window.lastResult = win;
}

function closeMsg() {
    document.getElementById('msg-overlay').classList.add('hidden');
    if(window.lastResult) {
        nivel++;
        if(nivel < misiones.length) resetLevel();
        else { alert("Mission 4 Terminée !"); window.location.href='index.html'; }
    }
}

window.onload = init;
