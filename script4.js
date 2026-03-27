// --- DATOS DE LAS MISIONES ---
const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (Hypoténuse), la base est à 3m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "b = 3m", c: "Hypoténuse = 5m", res: 4, mode: "soustrait" },
    { title: "L'Arbre", desc: "Arbre de 10m (Hypoténuse), pointe au sol à 6m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "b = 6m", c: "Hypoténuse = 10m", res: 8, mode: "soustrait" },
    { title: "Écran Géant", desc: "Base 80cm (Côté b), Hauteur 60cm (Côté a). Trouve l'Hypoténuse !", a: "a = 60cm", b: "b = 80cm", c: "Hypoténuse = ?", res: 100, mode: "additionne" },
    { title: "Rampe Skate", desc: "Hypoténuse = 5m, Côté a = 4m. Trouve le Côté b !", a: "a = 4m", b: "b = ?", c: "Hypoténuse = 5m", res: 3, mode: "soustrait" },
    { title: "Le Toit", desc: "Côté a = 12m, Côté b = 5m. Trouve l'Hypoténuse !", a: "a = 12m", b: "b = 5m", c: "Hypoténuse = ?", res: 13, mode: "additionne" }
];

let nivel = 0;
let canDraw = false, painting = false;
let startX, startY, lineasCount = 0;
let historial = [];
let v = ""; 

let canvas, ctx;

// --- INICIO DEL JUEGO ---
window.onload = function() {
    canvas = document.getElementById('main-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Al cargar, lo primero es limpiar todo para el Nivel 1
    resetLevel();
};

function resetLevel() {
    lineasCount = 0; 
    historial = [];
    canDraw = false;
    v = ""; 

    // Actualizar Interfaz
    document.getElementById('num-ex').innerText = nivel + 1;
    document.getElementById('title-mission').innerText = misiones[nivel].title;
    
    // CORRECCIÓN: Texto inicial antes de pulsar nada
    document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour voir l'énoncé.";
    document.getElementById('instruction-footer').innerText = "Étape 1: Lire l'énoncé du problème.";
    
    document.getElementById('calc-modal').classList.add('hidden');
    document.getElementById('calc-screen').innerText = "0";
    
    // Limpiar etiquetas
    document.querySelectorAll('.measure-tag').forEach(t => {
        t.style.display = "none";
        t.innerText = "";
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Resetear botones: Solo el 1 está activo
    document.getElementById('s1').className = "step-box active";
    document.getElementById('s2').className = "step-box locked";
    document.getElementById('s3').className = "step-box locked";
    
    document.getElementById('btn-pencil').style.background = "#5499c7";
}

// --- PASO 1: LEER ---
function doStep(s) {
    if (s === 1) {
        // Ahora sí, mostramos el problema y pedimos identificar
        document.getElementById('problem-desc').innerText = misiones[nivel].desc;
        
        document.getElementById('s1').classList.remove('active');
        document.getElementById('s2').classList.remove('locked');
        document.getElementById('s2').classList.add('active');
        
        document.getElementById('instruction-footer').innerText = "Étape 2: Identifie les Côtés et l'Hypoténuse avec le Crayon.";
    }
}

// --- PASO 2: DIBUJAR ---
function enableDrawing() {
    // Solo si el paso 2 está activo
    if(document.getElementById('s2').classList.contains('locked')) return;
    
    canDraw = true;
    document.getElementById('btn-pencil').style.background = "#39FF14";
    document.getElementById('instruction-footer').innerText = "Sergio, trace la ligne pour le Côté a.";
}

// --- LÓGICA DE DIBUJO ---
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 6; ctx.shadowBlur = 15; ctx.shadowColor = '#39FF14'; ctx.lineCap = "round";
    historial.forEach(l => { 
        ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke(); 
    });
}

// Mouse events corregidos para mayor precisión
window.onmousedown = (e) => {
    if(!canvas) return;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    if(x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        if(canDraw && lineasCount < 3) { painting = true; startX = x; startY = y; }
    }
};

window.onmousemove = (e) => {
    if (!painting) return;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    redraw();
    ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
};

window.onmouseup = (e) => {
    if(!painting) return;
    painting = false;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    historial.push({x1: startX, y1: startY, x2: x, y2: y});
    lineasCount++;
    showTag(x, y);
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

    if (lineasCount === 1) document.getElementById('instruction-footer').innerText = "Bien ! Trace le Côté b.";
    else if (lineasCount === 2) document.getElementById('instruction-footer').innerText = "Super ! Trace l'Hypoténuse.";
    else if (lineasCount === 3) {
        const m = misiones[nivel];
        document.getElementById('instruction-footer').innerHTML = `Parfait ! <b>${m.mode === "additionne" ? "Additionne (a²+b²)" : "Soustrait (c²-b²)"}</b> los carrés.`;
        document.getElementById('s2').classList.remove('active');
        document.getElementById('s3').classList.remove('locked');
        document.getElementById('s3').classList.add('active');
        document.getElementById('calc-modal').classList.remove('hidden');
    }
}

// --- CALCULADORA ---
function press(n) { v += n; document.getElementById('calc-screen').innerText = v; }
function cls() { v = ""; document.getElementById('calc-screen').innerText = "0"; }
function solve() { try { v = eval(v.replace('×','*')).toString(); document.getElementById('calc-screen').innerText = v; } catch(e) { cls(); } }
function solveSqrt() { if(v!=="") { v = Math.sqrt(eval(v)).toFixed(0); document.getElementById('calc-screen').innerText = v; } }

function verify() {
    const r = parseInt(document.getElementById('calc-screen').innerText);
    if(r === misiones[nivel].res) {
        showMsg("🏆 BIEN JOUÉ !", "Tu es un Maître de la Modélisation.", "#55efc4", true);
    } else {
        showMsg("⚠️ OUPS", "Vérifie tes calculs Sergio.", "#ff7675", false);
    }
}

function showMsg(t, txt, col, winStatus) {
    document.getElementById('msg-title').innerText = t; 
    document.getElementById('msg-text').innerText = txt;
    document.getElementById('msg-box').style.borderColor = col; 
    document.getElementById('msg-overlay').classList.remove('hidden');
    window.lastWinStatus = winStatus;
}

function closeMsg() {
    document.getElementById('msg-overlay').classList.add('hidden');
    if(window.lastWinStatus === true) { 
        nivel++; 
        if(nivel < misiones.length) {
            resetLevel(); 
        } else { 
            localStorage.setItem('mision4_completed', 'true'); 
            window.location.href='index.html'; 
        }
    }
    window.lastWinStatus = false;
}
