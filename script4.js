// Configuración de los 5 niveles de la Misión 4
const retos = [
    {
        id: 1,
        titulo: "La Escalera",
        texto: "El Inspector necesita subir a una ventana a 4m de altura. Coloca la base de la escalera a 3m de la pared. ¿Cuánto mide la escalera?",
        a: 3, b: 4, c: 5, // Pitágoras: 3² + 4² = 5²
        tipo: "suma"
    },
    {
        id: 2,
        titulo: "El Árbol Caído",
        texto: "Un árbol de 10m de largo se rompió. La punta toca el suelo a 6m de la base. ¿A qué altura quedó el tronco?",
        c: 10, b: 6, a: 8, // Pitágoras: 10² - 6² = 8²
        tipo: "resta"
    },
    {
        id: 3,
        titulo: "La Pantalla Gigante",
        texto: "Una TV mide 80cm de ancho y 60cm de alto. ¿Cuál es su medida diagonal?",
        a: 80, b: 60, c: 100,
        tipo: "suma"
    },
    {
        id: 4,
        titulo: "La Rampa de Skate",
        texto: "La rampa mide 5m de largo (diagonal) y su base mide 3m. ¿Qué altura tiene?",
        c: 5, b: 3, a: 4,
        tipo: "resta"
    },
    {
        id: 5,
        titulo: "El Techo de la Cabaña",
        texto: "Viga A = 12m, Viga B = 5m. Si la viga larga mide 13m, ¿es un ángulo recto? (Verifica: 12² + 5²)",
        a: 12, b: 5, c: 13,
        tipo: "verificar"
    }
];

let nivelActual = 0;
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// Iniciar misión
function cargarReto() {
    const reto = retos[nivelActual];
    document.getElementById('current-ex').innerText = nivelActual + 1;
    document.getElementById('problem-text').innerText = reto.texto;
    document.getElementById('mission-title').innerText = reto.titulo;
    limpiarCanvas();
}

function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujar guía de triángulo básica
    ctx.strokeStyle = "#ccc";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.lineTo(300, 300);
    ctx.lineTo(100, 100);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
}

// Lógica simple de calculadora
let calcVal = "";
function calcInput(n) { calcVal += n; actualizarDisplay(); }
function calcClear() { calcVal = ""; actualizarDisplay(); }
function actualizarDisplay() { document.getElementById('calc-display').innerText = calcVal || "0"; }
function calcSqrt() { 
    if(calcVal) {
        calcVal = Math.sqrt(eval(calcVal)).toFixed(2);
        actualizarDisplay();
    }
}
function calcRes() {
    try {
        calcVal = eval(calcVal).toString();
        actualizarDisplay();
    } catch { calcVal = "Error"; actualizarDisplay(); }
}

function toggleCalc() {
    document.getElementById('mini-calc').classList.toggle('hidden');
}

// Inicialización
window.onload = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cargarReto();
};
