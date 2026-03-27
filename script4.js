// 1. DATOS DE LOS 5 RETOS (CORREGIDOS A "CÔTÉ")
const misiones = [
    { title: "La Escalera", desc: "L'échelle mesure 5m (Hypoténuse), la base est à 3m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "Côté b = 3m", c: "Hypoténuse = 5m", res: 4, op: "resta" },
    { title: "L'Arbre", desc: "Arbre de 10m (Hypoténuse), pointe au sol à 6m (Côté b). Trouve le Côté a !", a: "Côté a = ?", b: "Côté b = 6m", c: "Hypoténuse = 10m", res: 8, op: "resta" },
    { title: "Écran Géant", desc: "Base 80cm (Côté b), Hauteur 60cm (Côté a). Trouve l'Hypoténuse !", a: "Côté a = 60cm", b: "Côté b = 80cm", c: "Hypoténuse = ?", res: 100, op: "suma" },
    { title: "Rampe Skate", desc: "Diagonale 5m (Hypoténuse), hauteur 4m (Côté a). Trouve le Côté b !", a: "Côté a = 4m", b: "Côté b = ?", c: "Hypoténuse = 5m", res: 3, op: "resta" },
    { title: "Le Toit", desc: "Côté a = 12m, Côté b = 5m. Trouve l'Hypoténuse !", a: "Côté a = 12m", b: "Côté b = 5m", c: "Hypoténuse = ?", res: 13, op: "suma" }
];

// ... (El resto de la lógica de dibujo se mantiene igual) ...

function showNextTag(ex, ey) {
    const tags = [document.getElementById('tag-a'), document.getElementById('tag-b'), document.getElementById('tag-c')];
    const labels = [misiones[nivel].a, misiones[nivel].b, misiones[nivel].c];
    
    let currentTag = tags[lineasDibujadas - 1];
    currentTag.innerText = labels[lineasDibujadas - 1];
    currentTag.style.left = (startX + (ex - startX)/2) + "px"; 
    currentTag.style.top = (startY + (ey - startY)/2 - 20) + "px";
    currentTag.style.display = "block";

    if (lineasDibujadas === 1) {
        document.getElementById('instruction-footer').innerText = "Bien ! Trace maintenant le deuxième Côté.";
    } else if (lineasDibujadas === 2) {
        document.getElementById('instruction-footer').innerText = "Super ! Maintenant, ferme le triangle con l'Hypoténuse.";
    } else if (lineasDibujadas === 3) {
        // PISTA DE CÁLCULO PARA SERGIO
        const m = misiones[nivel];
        let formulaHint = (m.op === "suma") ? "a² + b² = c² (Additionne)" : "c² - b² = a² (Soustrait)";
        
        document.getElementById('instruction-footer').innerHTML = 
            `<b style="color:#f1c40f">Modèle fini !</b> Utilise <span style="color:white">${formulaHint}</span> pour trouver la réponse.`;
        
        document.getElementById('s3').classList.remove('locked');
        document.getElementById('calc-modal').classList.remove('hidden');
    }
}

// ... (Funciones de calculadora y mensajes iguales) ...
