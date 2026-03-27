const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (Hypoténuse), la base est à 3m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "Côté b = 3m", c: "Hypoténuse = 5m", res: 4, mode: "soustrait" },
    { title: "L'Arbre", desc: "Arbre de 10m (Hypoténuse), pointe au sol à 6m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "Côté b = 6m", c: "Hypoténuse = 10m", res: 8, mode: "soustrait" },
    { title: "Écran Géant", desc: "Base 80cm (Côté b), Hauteur 60cm (Côté a). Trouve l'Hypoténuse !", a: "Côté a = 60cm", b: "Côté b = 80cm", c: "Hypoténuse = ?", res: 100, mode: "additionne" },
    { title: "Rampe Skate", desc: "Hypoténuse = 5m, Côté a = 4m. Trouve le Côté b !", a: "a = 4m", b: "b = ?", c: "c = 5m", res: 3, mode: "soustrait" },
    { title: "Le Toit", desc: "Côté a = 12m, Côté b = 5m. Trouve l'Hypoténuse !", a: "a = 12m", b: "b = 5m", c: "Hypoténuse = ?", res: 13, mode: "additionne" }
];

let nivel = 0;
let canDraw = false, painting = false;
let startX, startY, lineasCount = 0;
let historial = [];

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetLevel();
}

function resetLevel() {
    lineasCount = 0; 
    historial = [];
    canDraw = false;
    
    document.getElementById('num-ex').innerText = nivel + 1;
    document.getElementById('title-mission').innerText = misiones[nivel].title;
    document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour commencer.";
    document.getElementById('instruction-footer').innerText = "Identifie les Côtés et l'Hypoténuse.";
    
    document.getElementById('calc-modal').classList.add('hidden');
    document.querySelectorAll('.measure-tag').forEach(t => t.style.display = "none");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset Pasos
    document.getElementById('s1').className = "step-box active";
    document.getElementById('s2').className = "step-box locked";
    document.getElementById('s3').className = "step-box locked";
    
    document.getElementById('btn-pencil').style.background = "#5499c7";
    cls();
}

// ESTA FUNCIÓN ES LA QUE SE ACTIVA AL DAR CLICK A LIRE
function doStep(s) {
    if (s === 1) {
        // Mostramos el problema
        document.getElementById('problem-desc').innerText = misiones[nivel].desc;
        // Cambiamos estados visuales
        document.getElementById('s1').classList.remove('active');
        document.getElementById('s2').classList.remove('locked');
        document.getElementById('s2').classList.add('active');
        document.getElementById('instruction-footer').innerText = "Utilise le Crayon pour tracer les côtés.";
    }
}

function enableDrawing() {
    if(document.getElementById('s2').classList.contains('locked')) return;
    canDraw = true;
    document.getElementById('btn-pencil').style.background = "#39FF14";
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 6; ctx.shadowBlur = 15; ctx.shadowColor = '#39FF14'; ctx.lineCap = "round";
    historial.forEach(l => { 
        ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke(); 
    });
}

canvas.onmousedown = (e) => { if(canDraw && lineasCount < 3) { painting = true; startX = e.offsetX; startY = e.offsetY; } };
canvas.onmousemove = (e) => { if(painting) { redraw(); ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
canvas.onmouseup = (e) => {
    if(!painting) return;
    painting = false;
    historial.push({x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY});
    lineasCount++;
    showTag(e.offsetX, e.offsetY);
    redraw();
};

function showTag(ex, ey) {
    const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
    const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
    let tag = tags[lineasCount - 1];
    tag.innerText = labels[lineasCount - 1];
    tag.style.left = (startX + (ex - startX)/2) + "px"; 
    tag.style.top = (startY + (ey - startY)/2 - 15) + "px";
    tag.style.display = "block";

    if (lineasCount === 1) document.getElementById('instruction-footer').innerText = "Bien ! Maintenant trace le deuxième Côté.";
    else if (lineasCount === 2) document.getElementById('instruction-footer').innerText = "Super ! Finis avec l'Hypoténuse.";
    else if (lineasCount === 3) {
        const m = misiones[nivel];
        document.getElementById('instruction-footer').innerHTML = `Parfait ! <b>${m.mode === "additionne" ? "Additionne (a²+b²)" : "Soustrait (c²-b²)"}</b> les carrés.`;
        document.getElementById('s2').classList.remove('active');
        document.getElementById('s3').classList.remove('locked');
        document.getElementById('s3').classList.add('active');
        document.getElementById('calc-modal').classList.remove('hidden');
    }
}

// Calculadora
let v = "";
function press(n) { v += n; document.getElementById('calc-screen').innerText = v; }
function cls() { v = ""; document.getElementById('calc-screen').innerText = "0"; }
function solve() { try { v = eval(v).toString(); document.getElementById('calc-screen').innerText = v; } catch(e) { cls(); } }
function solveSqrt() { if(v) { v = Math.sqrt(eval(v)).toFixed(0); document.getElementById('calc-screen').innerText = v; } }

function verify() {
    const r = parseInt(document.getElementById('calc-screen').innerText);
    if(r === misiones[nivel].res) showMsg("🏆 BIEN JOUÉ !", "Le modèle est correct.", "#55efc4", true);
    else showMsg("⚠️ OUPS", "Vérifie tes mesures et le calcul.", "#ff7675", false);
}

function showMsg(t, txt, col, win) {
    document.getElementById('msg-title').innerText = t; document.getElementById('msg-text').innerText = txt;
    document.getElementById('msg-box').style.borderColor = col; document.getElementById('msg-overlay').classList.remove('hidden');
    window.levelWin = win;
}

function closeMsg() {
    document.getElementById('msg-overlay').classList.add('hidden');
    if(window.levelWin) { 
        nivel++; 
        if(nivel < misiones.length) resetLevel(); 
        else { localStorage.setItem('mision4_completed', 'true'); window.location.href = 'index.html'; }
    }
}

window.onload = init;
