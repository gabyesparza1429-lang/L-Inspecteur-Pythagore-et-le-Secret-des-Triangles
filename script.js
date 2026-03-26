// Sistema de pistas para Sergio
const pistas = [
    "Utilise ta souris pour dessiner les trois côtés du triangle.",
    "Glisse le chiffre 3 sur le premier carré vide de la formule.",
    "Glisse el chiffre 4 sur le deuxième carré vide.",
    "Maintenant, clique sur le bouton vert pour calculer !"
];
let pistaActual = 0;

function darPista() {
    const hintText = document.getElementById('hint-text');
    hintText.innerText = pistas[pistaActual];
    
    // Resaltar visualmente el objetivo actual
    if(pistaActual === 1 || pistaActual === 2) {
        document.querySelectorAll('.drop-target').forEach(t => t.style.boxShadow = "0 0 20px yellow");
    }
    
    pistaActual = (pistaActual + 1) % pistas.length;
}

// Lógica para que se vea la imagen aunque tenga espacios
window.onload = () => {
    const bg = document.getElementById('background-img');
    bg.onerror = function() {
        console.log("Error cargando imagen con espacios, intentando ruta alternativa...");
        bg.src = "images/mision%201.png"; 
    };
};

// ... (mantén el resto del código de arrastrar y soltar que ya teníamos)
