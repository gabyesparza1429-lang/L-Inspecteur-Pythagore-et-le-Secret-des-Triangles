// 1. DATOS DE LOS 5 RETOS
const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (Hypoténuse), la base est à 3m (Cateto b). Trouve le Cateto a !", a: "Cateto a = ?", b: "Cateto b = 3m", c: "Hypoténuse = 5m", res: 4 },
    { title: "L'Arbre", desc: "Arbre de 10m (Hypoténuse), pointe au sol à 6m (Cateto b). Trouve le Cateto a !", a: "Cateto a = ?", b: "Cateto b = 6m", c: "Hypoténuse = 10m", res: 8 },
    { title: "Écran Géant", desc: "Base 80cm (Cateto b), Hauteur 60cm (Cateto a). Trouve l'Hypoténuse !", a: "Cateto a = 60cm", b: "Cateto b = 80cm", c: "Hypoténuse = ?", res: 100 },
    { title: "Rampe Skate", desc: "Diagonale 5m (Hypoténuse), hauteur 4m (Cateto a). Trouve le Cateto b !", a: "Cateto a = 4m", b: "Cateto b = ?", c: "Hypoténuse = 5m", res: 3 },
    { title: "Le Toit", desc: "Cateto a = 12m, Cateto b = 5m. Trouve l'Hypoténuse !", a: "Cateto a = 12m", b: "Cateto b = 5m", c: "Hypoténuse = ?", res: 13 }
];

let nivel = 0;
let canDraw = false;
let painting = false;
let startX, startY;
let lineasDibujadas = 0;
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
    historialLineas = [];
    document.getElementById('num-ex').innerText = nivel + 1;
    document.getElementById('title-mission').innerText = misiones[nivel].title;
    document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour identifier les Catetos et l'Hypoténuse.";
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
        document.getElementById('instruction-footer').innerText = "Utilise le Crayon pour tracer les Catetos.";
    }
}

function enableDrawing() {
    if(document.getElementById('s2').classList.contains('locked')) return;
    canDraw = true;
    document.getElementById('btn-pencil').style.background = "#39FF14";
}

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
    redibujarTodo();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};

canvas.onmouseup = (e) => {
    if(!painting) return;
    painting = false;
    historialLineas.push({x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY});
    lineasDibujadas++;
    showNextTag(e.offsetX, e.offsetY);
    redibujarTodo();
};

function showNextTag(ex, ey) {
    const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
    const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
    
    let currentTag = tags[lineasDibujadas - 1];
    currentTag.innerText = labels[lineasDibujadas - 1];
    currentTag.style.left = (startX + (ex - startX)/2) + "px"; 
    currentTag.style.top = (startY + (ey - startY)/2 - 20) + "px";
    currentTag.style.display = "block";

    if (lineasDibujadas === 1) {
        document.getElementById('instruction-footer').innerText = "Bien ! Trace maintenant le deuxième Cateto.";
    } else if (lineasDibujadas === 2) {
        document.getElementById('instruction-footer').innerText = "Super ! Maintenant, ferme le triangle avec l'Hypoténuse.";
    } else if (lineasDibujadas === 3) {
        // AQUÍ ESTÁ EL CAMBIO DE INSTRUCCIÓN TÉCNICA
        const m = misiones[nivel];
        let formulaHint = m.res === m.c ? "a² + b² = c²" : "c² - b² = a²";
        document.getElementById('instruction-footer').innerText = `Modèle fini ! Utilise ${formulaHint} pour calculer la réponse.`;
        document.getElementById('s3').classList.remove('locked');
        document.getElementById('calc-modal').classList.remove('hidden');
    }
}

// --- Calculadora ---
let val = "";
function press(n) { val += n; document.getElementById('calc-screen').innerText = val; }
function cls() { val = ""; document.getElementById('calc-screen').innerText = "0"; }
function solve() { try { val = eval(val).toString(); document.getElementById('calc-screen').innerText = val; } catch(e) { cls(); } }
function solveSqrt() { val = Math.sqrt(eval(val)).toFixed(0); document.getElementById('calc-screen').innerText = val; }

function verify() {
    const r = parseInt(document.getElementById('calc-screen').innerText);
    if(r === misiones[nivel].res) {
        showMsg("🏆 BIEN JOUÉ !", "Modèle validé ! Tu maîtrises les Catetos et l'Hypoténuse.", "#55efc4", true);
    } else {
        showMsg("⚠️ OUPS, SERGIO", "Vérifie si tu dois additionner ou soustraire les carrés.", "#ff7675", false);
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
            window.location.href='index.html'; 
        }
    }
}

window.onload = init;
