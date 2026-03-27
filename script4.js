const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (c), la base est à 3m (b). Trouve la hauteur (a) !", a: "a = ?", b: "b = 3m", c: "c = 5m", res: 4 },
    { title: "L'Arbre", desc: "Arbre de 10m (c), pointe au sol à 6m (b). Hauteur du tronc (a)?", a: "a = ?", b: "b = 6m", c: "c = 10m", res: 8 },
    { title: "Écran Géant", desc: "Base 80cm (b), Hauteur 60cm (a). Trouve la diagonale (c) !", a: "a = 60cm", b: "b = 80cm", c: "c = ?", res: 100 },
    { title: "Rampe Skate", desc: "Rampe de 5m (c), hauteur de 4m (a). Trouve la base (b) !", a: "a = 4m", b: "b = ?", c: "c = 5m", res: 3 },
    { title: "Le Toit", desc: "Côté a=12m, Côté b=5m. Trouve la viga principale (c) !", a: "a = 12m", b: "b = 5m", c: "c = ?", res: 13 }
];

let nivel = 0;
let canDraw = false;
let painting = false;
let startX, startY;
let lineasDibujadas = 0;

// Aquí guardaremos las líneas para que no se borren
let historialLineas = []; 

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetLevel();
}

function resetLevel() {
    lineasDibujadas = 0;
    historialLineas = []; // Limpiamos el historial
    document.getElementById('num-ex').innerText = nivel + 1;
    document.getElementById('title-mission').innerText = misiones[nivel].title;
    document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour commencer.";
    document.getElementById('calc-modal').classList.add('hidden');
    document.querySelectorAll('.measure-tag').forEach(t => t.style.display = "none");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    document.getElementById('s2').classList.add('locked');
    document.getElementById('s3').classList.add('locked');
    document.getElementById('btn-pencil').style.background = "#5499c7";
}

function doStep(s) {
    if (s === 1) {
        document.getElementById('problem-desc').innerText = misiones[nivel].desc;
        document.getElementById('s2').classList.remove('locked');
    }
}

function enableDrawing() {
    if(document.getElementById('s2').classList.contains('locked')) return;
    canDraw = true;
    document.getElementById('btn-pencil').style.background = "#39FF14";
}

// FUNCION PARA RE-DIBUJAR TODO EL HISTORIAL
function redibujarTodo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14'; 
    ctx.lineWidth = 6; 
    ctx.shadowBlur = 15; 
    ctx.shadowColor = '#39FF14';
    ctx.lineCap = "round";

    historialLineas.forEach(linea => {
        ctx.beginPath();
        ctx.moveTo(linea.x1, linea.y1);
        ctx.lineTo(linea.x2, linea.y2);
        ctx.stroke();
    });
}

canvas.onmousedown = (e) => {
    if(!canDraw || lineasDibujadas >= 3) return;
    painting = true;
    startX = e.offsetX; 
    startY = e.offsetY;
};

canvas.onmousemove = (e) => {
    if (!painting) return;
    
    // Dibujamos el historial + la línea que se está moviendo actualmente
    redibujarTodo();
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};

canvas.onmouseup = (e) => {
    if(!painting) return;
    painting = false;
    
    // Guardamos la línea en el historial
    historialLineas.push({x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY});
    
    lineasDibujadas++;
    showNextTag(e.offsetX, e.offsetY);
    redibujarTodo(); // Aseguramos que se vea fija
};

function showNextTag(ex, ey) {
    const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
    const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
    
    let currentTag = tags[lineasDibujadas - 1];
    currentTag.innerText = labels[lineasDibujadas - 1];
    
    // Posición de la etiqueta en el medio de la línea dibujada
    currentTag.style.left = (startX + (ex - startX)/2) + "px"; 
    currentTag.style.top = (startY + (ey - startY)/2 - 20) + "px";
    currentTag.style.display = "block";

    if (lineasDibujadas === 3) {
        document.getElementById('s3').classList.remove('locked');
        document.getElementById('calc-modal').classList.remove('hidden');
        document.getElementById('instruction-footer').innerText = "Parfait ! Calcule la réponse.";
    }
}

// --- Lógica de Calculadora ---
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
        showMsg("⚠️ OUPS, SERGIO", "Regarde bien tes mesures y réessaie !", "#ff7675", false);
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
        else { 
            localStorage.setItem('mision4_completed', 'true');
            alert("Félicitations ! Misión 4 terminée."); 
            window.location.href='index.html'; 
        }
    }
}

window.onload = init;
