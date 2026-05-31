// ==========================================================================
// RIDEMANAGER - LÓGICA DE INTERACCIÓN Y CONTROL DE DATOS
// ==========================================================================

// Bases de datos temporales en memoria
let motocicletas = [];
let mantenimientos = [];

// Captura de elementos de la interfaz (Modales)
const modalLogin = document.getElementById('modal-login');
const modalMotos = document.getElementById('modal-motos');
const modalMantenimientos = document.getElementById('modal-mantenimientos');
const modalHistorial = document.getElementById('modal-historial');

// Asignación de clics a la barra de navegación para abrir ventanas
document.getElementById('nav-login').addEventListener('click', () => abrirModal(modalLogin));
document.getElementById('btn-iniciar-sesion').addEventListener('click', () => abrirModal(modalLogin));
document.getElementById('nav-motos').addEventListener('click', () => abrirModal(modalMotos));
document.getElementById('nav-mantenimientos').addEventListener('click', () => abrirModal(modalMantenimientos));
document.getElementById('nav-historial').addEventListener('click', () => abrirModal(modalHistorial));

document.getElementById('nav-inicio').addEventListener('click', () => {
    cerrarModales();
    actualizarActiveNav('nav-inicio');
});

document.getElementById('nav-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
    alert("¡Accediendo al panel analítico del Taller! (Módulo en construcción)");
});

// Funciones básicas de apertura y cierre
function abrirModal(modalTarget) {
    cerrarModales();
    modalTarget.classList.add('active');
}

function cerrarModales() {
    const modales = document.querySelectorAll('.modal-overlay');
    modales.forEach(m => m.classList.remove('active'));
}

// Cerrar modales si se hace clic afuera de la tarjeta blanca
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        cerrarModales();
    }
});

// ==========================================================================
// CONTROL DE MOTOCICLETAS (CREAR Y ELIMINAR)
// ==========================================================================
const formMoto = document.getElementById('form-moto');
formMoto.addEventListener('submit', (e) => {
    e.preventDefault();

    const placa = document.getElementById('moto-placa').value.toUpperCase().trim();
    const marca = document.getElementById('moto-marca').value.trim();
    const modelo = document.getElementById('moto-modelo').value.trim();

    // Validar duplicados
    if (motocicletas.some(m => m.placa === placa)) {
        alert("Esta motocicleta ya se encuentra registrada.");
        return;
    }

    // Agregar objeto al arreglo
    motocicletas.push({ placa, marca, modelo });
    formMoto.reset();
    
    actualizarTablaMotos();
    actualizarSelectMantenimientos();
});

function actualizarTablaMotos() {
    const tabla = document.getElementById('lista-motos');
    if (motocicletas.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay motocicletas registradas.</td></tr>`;
        return;
    }

    tabla.innerHTML = "";
    motocicletas.forEach((moto, index) => {
        tabla.innerHTML += `
            <tr>
                <td><strong>${moto.placa}</strong></td>
                <td>${moto.marca}</td>
                <td>${moto.modelo}</td>
                <td><button class="btn-danger" onclick="eliminarMotocicleta(${index})">Eliminar</button></td>
            </tr>
        `;
    });
}

function eliminarMotocicleta(index) {
    motocicletas.splice(index, 1);
    actualizarTablaMotos();
    actualizarSelectMantenimientos();
}

// Actualizar las opciones del formulario de mantenimiento
function actualizarSelectMantenimientos() {
    const select = document.getElementById('select-moto-mantenimiento');
    select.innerHTML = '<option value="">-- Seleccione una placa --</option>';
    motocicletas.forEach(moto => {
        select.innerHTML += `<option value="${moto.placa}">${moto.placa} (${moto.marca})</option>`;
    });
}

// ==========================================================================
// CONTROL DE MANTENIMIENTOS Y HISTORIAL
// ==========================================================================
const formMantenimiento = document.getElementById('form-mantenimiento');
formMantenimiento.addEventListener('submit', (e) => {
    e.preventDefault();

    const placa = document.getElementById('select-moto-mantenimiento').value;
    const servicio = document.getElementById('mant-servicio').value.trim();
    const fecha = document.getElementById('mant-fecha').value;

    mantenimientos.push({ fecha, placa, servicio, estado: "Asignado" });
    formMantenimiento.reset();
    alert("Orden de servicio creada con éxito.");
    cerrarModales();
    actualizarTablaHistorial();
});

function actualizarTablaHistorial() {
    const tabla = document.getElementById('lista-historial');
    if (mantenimientos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay mantenimientos registrados aún.</td></tr>`;
        return;
    }

    tabla.innerHTML = "";
    mantenimientos.forEach(mant => {
        tabla.innerHTML += `
            <tr>
                <td>${mant.fecha}</td>
                <td><span style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">${mant.placa}</span></td>
                <td>${mant.servicio}</td>
                <td><span style="color:#2563eb; font-weight:600;">${mant.estado}</span></td>
            </tr>
        `;
    });
}

// Manejo del estado visual activo en el menú
function actualizarActiveNav(idActivo) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById(idActivo).classList.add('active');
}