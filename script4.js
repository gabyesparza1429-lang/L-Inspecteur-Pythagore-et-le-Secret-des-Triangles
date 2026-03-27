window.onload = function() {
    const misiones = [
        { title: "La Escalera", desc: "L'échelle mesure 5m (Hypoténuse), la base est à 3m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "Côté b = 3m", c: "Hypoténuse = 5m", res: 4, mode: "Soustrait (c² - b²)" },
        { title: "L'Arbre", desc: "Arbre de 10m (Hypoténuse), pointe au sol à 6m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "b = 6m", c: "c = 10m", res: 8, mode: "Soustrait (c² - b²)" },
        { title: "Écran Géant", desc: "Base 80cm (Côté b), Hauteur 60cm (Côté a). Trouve l'Hypoténuse !", a: "a = 60cm", b: "b = 80cm", c: "c = ?", res: 100, mode: "Additionne (a² + b²)" },
        { title: "Rampe Skate", desc: "Hypoténuse = 5m, Côté a = 4m. Trouve le Côté b !", a: "a = 4m", b: "b = ?", c: "c = 5m", res: 3, mode: "Soustrait (c² - a²)" },
        { title: "Le Toit", desc: "Côté a = 12m, Côté b = 5m. Trouve l'Hypoténuse !", a: "a = 12m", b: "b = 5m", c: "c = ?", res: 13, mode: "Additionne (a² + b²)" }
    ];

    let nivel = 0;
    let canDraw = false, painting = false, startX, startY, lineasCount = 0;
    let historial = [], calcVal = "";

    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();

    function resetLevel() {
        lineasCount = 0; historial = []; canDraw = false; calcVal = "";
        document.getElementById('num-ex').innerText = nivel + 1;
        document.getElementById('title-mission').innerText = misiones[nivel].title;
        document.getElementById('problem-desc').innerText = "Clique sur 'Lire' pour commencer.";
        document.getElementById('instruction-footer').innerText = "Étape 1: Lire l'énoncé.";
        
        document.getElementById('calc-modal').classList.add('hidden');
        document.getElementById('calc-screen').innerText = "0";
        document.querySelectorAll('.measure-tag').forEach(t => t.style.display = "none");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        document.getElementById('s1').className = "step-box active";
        document.getElementById('s2').className = "step-box locked";
        document.getElementById('s3').className = "step-box locked";
        document.getElementById('btn-pencil').style.background = "#5499c7";
    }

    // PASO 1: LIRE
   const s1 = document.getElementById('s1');
if (s1) {
    s1.addEventListener('click', function() {
        document.getElementById('problem-desc').innerText = misiones[nivel].desc;
        this.className = "step-box";
        document.getElementById('s2').className = "step-box active";
        document.getElementById('instruction-footer').innerText = "Étape 2: Active le Crayon.";
    });
}

    // BOTÓN LÁPIZ
    document.getElementById('btn-pencil').onclick = function() {
        if(document.getElementById('s2').classList.contains('active')) {
            canDraw = true;
            this.style.background = "#39FF14";
            document.getElementById('instruction-footer').innerText = "Trace le Côté a.";
        }
    };

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 6; ctx.shadowBlur = 15; ctx.shadowColor = '#39FF14'; ctx.lineCap = "round";
        historial.forEach(l => { ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke(); });
    }

    canvas.onmousedown = (e) => { if(canDraw && lineasCount < 3) { painting = true; startX = e.offsetX; startY = e.offsetY; } };
    canvas.onmousemove = (e) => { if(painting) { redraw(); ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
    canvas.onmouseup = (e) => {
        if(!painting) return;
        painting = false;
        historial.push({x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY});
        lineasCount++;
        
        const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
        const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
        let t = tags[lineasCount-1];
        t.innerText = labels[lineasCount-1];
        t.style.left = (startX + (e.offsetX - startX)/2) + "px";
        t.style.top = (startY + (e.offsetY - startY)/2 - 15) + "px";
        t.style.display = "block";

        if(lineasCount === 3) {
            document.getElementById('instruction-footer').innerHTML = `Modèle fini ! <b>${misiones[nivel].mode}</b>.`;
            document.getElementById('s2').className = "step-box";
            document.getElementById('s3').className = "step-box active";
            document.getElementById('calc-modal').classList.remove('hidden');
        } else {
            document.getElementById('instruction-footer').innerText = lineasCount === 1 ? "Trace le Côté b." : "Trace l'Hypoténuse.";
        }
        redraw();
    };

    // CALCULADORA
    document.querySelectorAll('.num-btn').forEach(b => b.onclick = () => { calcVal += b.innerText; document.getElementById('calc-screen').innerText = calcVal; });
    document.querySelectorAll('.op-btn').forEach(b => b.onclick = () => { if(b.id !== 'sqrt-btn') { calcVal += b.innerText; document.getElementById('calc-screen').innerText = calcVal; } });
    document.getElementById('clr-btn').onclick = () => { calcVal = ""; document.getElementById('calc-screen').innerText = "0"; };
    document.getElementById('equal-btn').onclick = () => { try { calcVal = eval(calcVal.replace('×','*')).toString(); document.getElementById('calc-screen').innerText = calcVal; } catch(e) { calcVal = ""; } };
    document.getElementById('sqrt-btn').onclick = () => { calcVal = Math.sqrt(eval(calcVal)).toFixed(0); document.getElementById('calc-screen').innerText = calcVal; };

    document.getElementById('btn-validar').onclick = () => {
        if(parseInt(document.getElementById('calc-screen').innerText) === misiones[nivel].res) {
            showMsg("🏆 BIEN JOUÉ !", "Tu es un Maître de la Modélisation.", "#55efc4", true);
        } else {
            showMsg("⚠️ OUPS", "Vérifie tes calculs Sergio.", "#ff7675", false);
        }
    };

    function showMsg(t, txt, col, win) {
        document.getElementById('msg-title').innerText = t; 
        document.getElementById('msg-text').innerText = txt;
        document.getElementById('msg-box').style.borderColor = col; 
        document.getElementById('msg-overlay').classList.remove('hidden');
        window.isWin = win;
    }

    document.getElementById('msg-btn').onclick = () => {
        document.getElementById('msg-overlay').classList.add('hidden');
        if(window.isWin) { nivel++; if(nivel < misiones.length) resetLevel(); else window.location.href = 'index.html'; }
    };

    resetLevel();
};
