window.onload = function() {
    const misiones = [
        { title: "La Escalera", desc: "L'échelle mesure 5m (Hypoténuse), la base est à 3m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "b = 3m", c: "c = 5m", res: 4, mode: "soustrait" },
        { title: "L'Arbre", desc: "Arbre de 10m (Hypoténuse), pointe au sol à 6m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "b = 6m", c: "c = 10m", res: 8, mode: "soustrait" },
        { title: "Écran Géant", desc: "Base 80cm (Côté b), Hauteur 60cm (Côté a). Trouve l'Hypoténuse !", a: "a = 60cm", b: "b = 80cm", c: "c = ?", res: 100, mode: "additionne" },
        { title: "Rampe Skate", desc: "Hypoténuse = 5m, Côté a = 4m. Trouve le Côté b !", a: "a = 4m", b: "b = ?", c: "c = 5m", res: 3, mode: "soustrait" },
        { title: "Le Toit", desc: "Côté a = 12m, Côté b = 5m. Trouve l'Hypoténuse !", a: "a = 12m", b: "b = 5m", c: "c = ?", res: 13, mode: "additionne" }
    ];

    let nivel = 0;
    let canDraw = false, painting = false;
    let startX, startY, lineasCount = 0;
    let historial = [];
    let calcVal = "";

    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext('2d');

    // Inicializar tamaño del canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function resetLevel() {
        lineasCount = 0; historial = []; canDraw = false; calcVal = "";
        document.getElementById('num-ex').innerText = nivel + 1;
        document.getElementById('title-mission').innerText = misiones[nivel].title;
        document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour commencer.";
        document.getElementById('instruction-footer').innerText = "Identifie les Côtés et l'Hypoténuse.";
        document.getElementById('calc-modal').classList.add('hidden');
        document.getElementById('calc-screen').innerText = "0";
        document.querySelectorAll('.measure-tag').forEach(t => t.style.display = "none");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        document.getElementById('s1').className = "step-box active";
        document.getElementById('s2').className = "step-box locked";
        document.getElementById('s3').className = "step-box locked";
        document.getElementById('btn-pencil').style.background = "#5499c7";
    }

    // EVENTOS DE BOTONES DE PASOS
    document.getElementById('s1').addEventListener('click', function() {
        document.getElementById('problem-desc').innerText = misiones[nivel].desc;
        this.classList.remove('active');
        document.getElementById('s2').classList.remove('locked');
        document.getElementById('s2').classList.add('active');
        document.getElementById('instruction-footer').innerText = "Active le Crayon et trace les 3 côtés.";
    });

    document.getElementById('btn-pencil').addEventListener('click', function() {
        if(!document.getElementById('s2').classList.contains('locked')) {
            canDraw = true;
            this.style.background = "#39FF14";
        }
    });

    // DIBUJO
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 6; ctx.shadowBlur = 15; ctx.shadowColor = '#39FF14'; ctx.lineCap = "round";
        historial.forEach(l => { ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke(); });
    }

    canvas.addEventListener('mousedown', (e) => { 
        if(canDraw && lineasCount < 3) { painting = true; startX = e.offsetX; startY = e.offsetY; } 
    });

    canvas.addEventListener('mousemove', (e) => { 
        if(painting) { redraw(); ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } 
    });

    canvas.addEventListener('mouseup', (e) => {
        if(!painting) return;
        painting = false;
        historial.push({x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY});
        lineasCount++;
        showTag(e.offsetX, e.offsetY);
        redraw();
    });

    function showTag(ex, ey) {
        const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
        const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
        let tag = tags[lineasCount - 1];
        tag.innerText = labels[lineasCount - 1];
        tag.style.left = (startX + (ex - startX)/2) + "px"; tag.style.top = (startY + (ey - startY)/2 - 15) + "px";
        tag.style.display = "block";

        if (lineasCount === 3) {
            const m = misiones[nivel];
            document.getElementById('instruction-footer').innerHTML = `Parfait ! <b>${m.mode === "additionne" ? "Additionne (a²+b²)" : "Soustrait (c²-b²)"}</b> les carrés.`;
            document.getElementById('s2').classList.remove('active');
            document.getElementById('s3').classList.remove('locked');
            document.getElementById('s3').classList.add('active');
            document.getElementById('calc-modal').classList.remove('hidden');
        }
    }

    // CALCULADORA
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', () => { calcVal += btn.innerText; document.getElementById('calc-screen').innerText = calcVal; });
    });
    document.querySelectorAll('.op-btn').forEach(btn => {
        btn.addEventListener('click', () => { if(btn.innerText !== '√') { calcVal += btn.innerText; document.getElementById('calc-screen').innerText = calcVal; } });
    });
    document.getElementById('clr-btn').addEventListener('click', () => { calcVal = ""; document.getElementById('calc-screen').innerText = "0"; });
    document.getElementById('equal-btn').addEventListener('click', () => { try { calcVal = eval(calcVal.replace('×','*')).toString(); document.getElementById('calc-screen').innerText = calcVal; } catch(e) { calcVal = ""; } });
    document.getElementById('sqrt-btn').addEventListener('click', () => { calcVal = Math.sqrt(eval(calcVal)).toFixed(0); document.getElementById('calc-screen').innerText = calcVal; });

    document.getElementById('btn-validar').addEventListener('click', () => {
        const r = parseInt(document.getElementById('calc-screen').innerText);
        if(r === misiones[nivel].res) showMsg("🏆 BIEN JOUÉ !", "Le modèle est correct.", "#55efc4", true);
        else showMsg("⚠️ OUPS", "Vérifie tes mesures y el calcul.", "#ff7675", false);
    });

    function showMsg(t, txt, col, win) {
        document.getElementById('msg-title').innerText = t; document.getElementById('msg-text').innerText = txt;
        document.getElementById('msg-box').style.borderColor = col; document.getElementById('msg-overlay').classList.remove('hidden');
        window.levelWin = win;
    }

    document.getElementById('msg-btn').addEventListener('click', () => {
        document.getElementById('msg-overlay').classList.add('hidden');
        if(window.levelWin) { 
            nivel++; 
            if(nivel < misiones.length) resetLevel(); 
            else { localStorage.setItem('mision4_completed', 'true'); window.location.href = 'index.html'; }
        }
    });

    resetLevel();
};
