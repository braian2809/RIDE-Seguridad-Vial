let idiomaActual = 'es';

const textos = {
    es: {
        volver: "← Volver al inicio",
        titulo: "🚲 Seguridad en Bicicleta",
        subtitulo: "Revisa tu estado, conoce las normas y calcula tu nivel de riesgo",
        normas: "📋 Normas de Tránsito",
        chequeo: "🔧 Chequeo Preventivo",
        calculadora: "📊 Calculadora de Riesgo",
        velocidad: "Velocidad (km/h)",
        calcular: "Calcular Riesgo",
        sin_normas: "No hay normas cargadas",
        sin_componentes: "No hay componentes registrados",
        error_normas: "Error cargando normas",
        error_checklist: "Error cargando checklist",
        buen_estado: "en buen estado"
    },
    en: {
        volver: "← Back to home",
        titulo: "🚲 Bicycle Safety",
        subtitulo: "Check your status, know the rules and calculate your risk level",
        normas: "📋 Traffic Regulations",
        chequeo: "🔧 Preventive Check",
        calculadora: "📊 Risk Calculator",
        velocidad: "Speed (km/h)",
        calcular: "Calculate Risk",
        sin_normas: "No regulations loaded",
        sin_componentes: "No registered components",
        error_normas: "Error loading regulations",
        error_checklist: "Error loading checklist",
        buen_estado: "in good condition"
    }
};

const btnIdioma = document.getElementById('btnIdioma');
const btnVolver = document.getElementById('btnVolver');

function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    btnIdioma.innerHTML = idiomaActual === 'es' ? '<i class="fas fa-globe"></i> EN' : '<i class="fas fa-globe"></i> ES';
    
    if(btnVolver) btnVolver.innerHTML = textos[idiomaActual].volver;
    
    const titulo = document.querySelector('.page-header h1');
    const subtitulo = document.querySelector('.page-header p');
    if(titulo) titulo.innerHTML = textos[idiomaActual].titulo;
    if(subtitulo) subtitulo.textContent = textos[idiomaActual].subtitulo;
    
    const cards = document.querySelectorAll('.card h2');
    if(cards[0]) cards[0].innerHTML = '<i class="fas fa-gavel"></i> ' + textos[idiomaActual].normas;
    if(cards[1]) cards[1].innerHTML = '<i class="fas fa-clipboard-list"></i> ' + textos[idiomaActual].chequeo;
    if(cards[2]) cards[2].innerHTML = '<i class="fas fa-chart-line"></i> ' + textos[idiomaActual].calculadora;
    
    const inputVelocidad = document.getElementById('velocidad');
    if(inputVelocidad) inputVelocidad.placeholder = textos[idiomaActual].velocidad;
    
    const btnCalcular = document.getElementById('calcularRiesgo');
    if(btnCalcular) btnCalcular.textContent = textos[idiomaActual].calcular;
    
    
    const checkLabels = document.querySelectorAll('#componentes-check label');
    checkLabels.forEach(label => {
        const text = label.innerText.split(' ')[0];
        label.innerHTML = `<input type="checkbox" class="check-riesgo" data-nombre="${text}"> ${text} ${textos[idiomaActual].buen_estado}`;
    });
    
    localStorage.setItem('idioma_bici', idiomaActual);
    mostrarToast('🌐 ' + (idiomaActual === 'es' ? 'Español' : 'English'));
}

if(btnIdioma) btnIdioma.addEventListener('click', cambiarIdioma);
if(btnVolver) btnVolver.addEventListener('click', () => window.location.href = '/');

const guardado = localStorage.getItem('idioma_bici');
if(guardado && guardado !== idiomaActual) {
    idiomaActual = guardado;
    setTimeout(() => cambiarIdioma(), 100);
}