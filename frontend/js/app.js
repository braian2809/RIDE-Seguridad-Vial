let idiomaActual = 'es';

const textos = {
    es: {
        inicio: "Inicio",
        registrar: "Registrarse",
        titulo: "Tu seguridad, nuestra prioridad",
        subtitulo: "Información clara, chequeos técnicos y normas adaptadas para cada tipo de vehículo.",
        bicicleta_titulo: "Bicicleta",
        bicicleta_texto: "Consejos de movilidad segura, normas para ciclistas, checklist de luces, frenos y más.",
        moto_titulo: "Moto",
        moto_texto: "Normas de tránsito específicas, multas, mantenimiento preventivo y equipo obligatorio.",
        explorar: "Explorar",
        badge: "Conducción consciente",
        modal_titulo: "Regístrate en R.I.D.E.",
        nombre: "Nombre completo *",
        correo: "Correo electrónico *",
        edad: "Edad *",
        tipo_vehiculo: "Tipo de vehículo *",
        moto_opcion: "🏍️ Moto",
        bicicleta_opcion: "🚲 Bicicleta",
        cilindraje: "Cilindraje (solo para moto)",
        mensaje: "Mensaje motivador personalizado",
        registrar_btn: "Registrarse",
        cerrar: "×",
        footer: "R.I.D.E — Road Information & Digital Enforcement · Seguridad vial para todos · SENA CBA 2026",
        feature1_titulo: "Chequeo Rápido",
        feature1_texto: "Frenos, luces, casco: diagnóstico en segundos",
        feature2_titulo: "Evita Multas",
        feature2_texto: "Infórmate sobre el código de tránsito actualizado",
        feature3_titulo: "Cultura Vial",
        feature3_texto: "Comparte la vía con respeto y reduce accidentes",
        feature4_titulo: "Calculadora de Riesgo",
        feature4_texto: "Evalúa tu nivel de riesgo antes de salir"
    },
    en: {
        inicio: "Home",
        registrar: "Register",
        titulo: "Your safety, our priority",
        subtitulo: "Clear information, technical checks and adapted regulations for each type of vehicle.",
        bicicleta_titulo: "Bicycle",
        bicicleta_texto: "Safe mobility tips, regulations for cyclists, checklist of lights, brakes and more.",
        moto_titulo: "Motorcycle",
        moto_texto: "Specific traffic regulations, fines, preventive maintenance and mandatory equipment.",
        explorar: "Explore",
        badge: "Conscious driving",
        modal_titulo: "Register at R.I.D.E.",
        nombre: "Full name *",
        correo: "Email *",
        edad: "Age *",
        tipo_vehiculo: "Vehicle type *",
        moto_opcion: "🏍️ Motorcycle",
        bicicleta_opcion: "🚲 Bicycle",
        cilindraje: "Displacement (for motorcycle only)",
        mensaje: "Personalized motivational message",
        registrar_btn: "Register",
        cerrar: "×",
        footer: "R.I.D.E — Road Information & Digital Enforcement · Road safety for everyone · SENA CBA 2026",
        feature1_titulo: "Quick Check",
        feature1_texto: "Brakes, lights, helmet: diagnosis in seconds",
        feature2_titulo: "Avoid Fines",
        feature2_texto: "Get updated traffic code information",
        feature3_titulo: "Road Culture",
        feature3_texto: "Share the road respectfully and reduce accidents",
        feature4_titulo: "Risk Calculator",
        feature4_texto: "Evaluate your risk level before leaving"
    }
};

const btnIdioma = document.getElementById('btnIdioma');
const btnRegistro = document.getElementById('btnRegistro');
const modal = document.getElementById('modalRegistro');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('formRegistro');

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

async function registrarUsuario(event) {
    event.preventDefault();
    const datos = {
        nombre: document.getElementById('regNombre').value,
        correo: document.getElementById('regCorreo').value,
        edad: document.getElementById('regEdad').value,
        tipo_vehiculo: document.getElementById('regTipoVehiculo').value,
        cil_val: document.getElementById('regCilindraje').value || null,
        mensaje_mot: document.getElementById('regMensaje').value || null
    };
    
    try {
        const response = await fetch('/api/usuarios/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await response.json();
        if (resultado.success) {
            mostrarToast('✅ ' + resultado.message);
            if(resultado.mensaje_bienvenida) mostrarToast(resultado.mensaje_bienvenida);
            modal.style.display = 'none';
            form.reset();
        } else {
            mostrarToast('❌ Error: ' + resultado.error);
        }
    } catch (error) {
        mostrarToast('❌ Error de conexión');
    }
}

function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    btnIdioma.innerHTML = idiomaActual === 'es' ? '<i class="fas fa-globe"></i> English' : '<i class="fas fa-globe"></i> Español';
    
    const navLinks = document.querySelectorAll('.nav-links a');
    if(navLinks[0]) navLinks[0].textContent = textos[idiomaActual].inicio;
    if(navLinks[1]) navLinks[1].textContent = textos[idiomaActual].registrar;
    
    const badge = document.querySelector('.badge');
    const titulo = document.querySelector('.hero h1');
    const subtitulo = document.querySelector('.hero .subtitle');
    if(badge) badge.innerHTML = '<i class="fas fa-road"></i> ' + textos[idiomaActual].badge;
    if(titulo) titulo.innerHTML = textos[idiomaActual].titulo;
    if(subtitulo) subtitulo.textContent = textos[idiomaActual].subtitulo;
    
    const cards = document.querySelectorAll('.option-card');
    if(cards[0]) {
        cards[0].querySelector('h3').textContent = textos[idiomaActual].bicicleta_titulo;
        cards[0].querySelector('p').textContent = textos[idiomaActual].bicicleta_texto;
        cards[0].querySelector('.start-button').innerHTML = textos[idiomaActual].explorar + ' <i class="fas fa-arrow-right"></i>';
    }
    if(cards[1]) {
        cards[1].querySelector('h3').textContent = textos[idiomaActual].moto_titulo;
        cards[1].querySelector('p').textContent = textos[idiomaActual].moto_texto;
        cards[1].querySelector('.start-button').innerHTML = textos[idiomaActual].explorar + ' <i class="fas fa-arrow-right"></i>';
    }
    

    const features = document.querySelectorAll('.feature-card');
    if(features[0]) {
        features[0].querySelector('h4').textContent = textos[idiomaActual].feature1_titulo;
        features[0].querySelector('p').textContent = textos[idiomaActual].feature1_texto;
    }
    if(features[1]) {
        features[1].querySelector('h4').textContent = textos[idiomaActual].feature2_titulo;
        features[1].querySelector('p').textContent = textos[idiomaActual].feature2_texto;
    }
    if(features[2]) {
        features[2].querySelector('h4').textContent = textos[idiomaActual].feature3_titulo;
        features[2].querySelector('p').textContent = textos[idiomaActual].feature3_texto;
    }
    if(features[3]) {
        features[3].querySelector('h4').textContent = textos[idiomaActual].feature4_titulo;
        features[3].querySelector('p').textContent = textos[idiomaActual].feature4_texto;
    }
    
    const modalTitulo = document.querySelector('#modalRegistro h2');
    const labels = document.querySelectorAll('.form-group label');
    const select = document.getElementById('regTipoVehiculo');
    const btnSubmit = document.querySelector('.btn-submit');
    if(modalTitulo) modalTitulo.innerHTML = '<i class="fas fa-user-plus"></i> ' + textos[idiomaActual].modal_titulo;
    if(labels[0]) labels[0].textContent = textos[idiomaActual].nombre;
    if(labels[1]) labels[1].textContent = textos[idiomaActual].correo;
    if(labels[2]) labels[2].textContent = textos[idiomaActual].edad;
    if(labels[3]) labels[3].textContent = textos[idiomaActual].tipo_vehiculo;
    if(labels[4]) labels[4].textContent = textos[idiomaActual].cilindraje;
    if(labels[5]) labels[5].textContent = textos[idiomaActual].mensaje;
    if(select) {
        select.options[0].text = textos[idiomaActual].moto_opcion;
        select.options[1].text = textos[idiomaActual].bicicleta_opcion;
    }
    if(btnSubmit) btnSubmit.textContent = textos[idiomaActual].registrar_btn;
    
    const footer = document.querySelector('footer p');
    if(footer) footer.textContent = textos[idiomaActual].footer;
    
    localStorage.setItem('idioma', idiomaActual);
    mostrarToast('🌐 ' + (idiomaActual === 'es' ? 'Español' : 'English'));
}

function abrirModal() { modal.style.display = 'block'; }
function cerrarModal() { modal.style.display = 'none'; }

btnRegistro?.addEventListener('click', abrirModal);
btnIdioma?.addEventListener('click', cambiarIdioma);
closeBtn?.addEventListener('click', cerrarModal);
window.onclick = (e) => { if(e.target === modal) cerrarModal(); }
form?.addEventListener('submit', registrarUsuario);

document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
        const vehiculo = card.getAttribute('data-vehiculo');
        window.location.href = vehiculo === 'bicicleta' ? '/bicicleta' : '/moto';
    });
});

const guardado = localStorage.getItem('idioma');
if(guardado && guardado !== idiomaActual) {
    idiomaActual = guardado;
    setTimeout(() => cambiarIdioma(), 100);
}

console.log('🚀 R.I.D.E. Frontend cargado');