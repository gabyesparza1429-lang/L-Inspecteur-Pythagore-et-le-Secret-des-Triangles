const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (c), la base est à 3m (b). Trouve la hauteur (a) !", a: "a = ?", b: "b = 3m", c: "c = 5m", res: 4 },
    { title: "L'Arbre", desc: "Arbre de 10m (c), pointe au sol à 6m (b). Hauteur du tronc (a)?", a: "a = ?", b: "b = 6m", c: "c = 10m", res: 8 }
];

let nivel = 0;
let canDraw = false;
let painting = false;
let startX, startY;
let lineasDibujadas = 0; // Contador de líneas para Sergio

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetLevel();
}

function resetLevel() {
    lineasDibujadas = 0;
    document.getElementById('num-ex').innerText = nivel + 1;
    document.getElementById('title-mission').innerText = misiones[nivel].title;
    document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour commencer.";
    document.getElementById('calc-modal').classList.add('hidden');
    document.querySelectorAll('.measure-tag').forEach(t => t.style.display = "none");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('s2').classList.add('locked');
    document.getElementById('s3').classList.add('locked');
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
    document.getElementById('instruction-footer').innerText = "Trace la première ligne (le côté a) !";
}

canvas.onmousedown = (e) => {
    if(!canDraw || lineasDibujadas >= 3) return;
    painting = true;
    startX = e.offsetX; startY = e.offsetY;
};

canvas.onmousemove = (e) => {
    if (!painting) return;
    // No borramos el canvas completo para que las líneas anteriores se queden
    // Solo dibujamos la línea actual temporalmente (si quieres un efecto más limpio)
};

canvas.onmouseup = (e) => {
    if(!painting) return;
    painting = false;
    
    // Dibujamos la línea definitiva
    ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 6; ctx.shadowBlur = 15; ctx.shadowColor = '#39FF14';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    lineasDibujadas++;
    showNextTag(e.offsetX, e.offsetY);
};

function showNextTag(ex, ey) {
    const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
    const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
    
    // Mostrar la etiqueta de la línea recién dibujada
    let currentTag = tags[lineasDibujadas - 1];
    currentTag.innerText = labels[lineasDibujadas - 1];
    currentTag.style.left = (startX + (ex - startX)/2) + "px"; 
    currentTag.style.top = (startY + (ey - startY)/2) + "px";
    currentTag.style.display = "block";

    if (lineasDibujadas === 1) {
        document.getElementById('instruction-footer').innerText = "Super ! Maintenant trace la base (côté b).";
    } else if (lineasDibujadas === 2) {
        document.getElementById('instruction-footer').innerText = "Bien ! Ferme le triangle avec l'hypoténuse (côté c).";
    } else if (lineasDibujadas === 3) {
        document.getElementById('instruction-footer').innerText = "Parfait ! Le modèle est fini. Calcule la réponse.";
        document.getElementById('s3').classList.remove('locked');
        document.getElementById('calc-modal').classList.remove('hidden');
    }
}

// Lógica de calculadora y mensajes (se mantiene igual que el anterior...)
