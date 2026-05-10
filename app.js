// ============================================================
// PANEL DE GESTIÓN DE USUARIOS - JavaScript (ES6+)
// ============================================================

// Estado principal: arreglo de objetos usuarios
let usuarios = [
    {
        nombre: "Sebastián Luengo",
        edad: 32,
        rol: "Administrador",
        activo: true
    },
    {
        nombre: "Daniela García",
        edad: 35,
        rol: "Usuario",
        activo: true
    }
];

// Variable para controlar el filtro actual
let filtroActual = "todos";

// Variable para controlar el orden por edad
let ordenAscendente = true;

// ============================================================
// FUNCIÓN: renderTable(datos)
// Genera dinámicamente las filas de la tabla usando document.createElement
// Parámetros: datos - arreglo de usuarios a mostrar
// ============================================================
function renderTable(datos) {
    const tablaUsuarios = document.getElementById("tablaUsuarios");
    const mensajeVacio = document.getElementById("mensajeVacio");

    // Limpiar tabla anterior
    tablaUsuarios.innerHTML = "";

    // Si no hay datos, mostrar mensaje
    if (datos.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    // Crear filas dinámicamente
    datos.forEach((usuario, index) => {
        // Crear fila
        const fila = document.createElement("tr");

        // Agregar clase según estado
        if (!usuario.activo) {
            fila.classList.add("table-secondary", "opacity-50");
        }

        // Crear celda de índice
        const celdaIndice = document.createElement("td");
        celdaIndice.textContent = index + 1;
        celdaIndice.className = "text-center";

        // Crear celda de nombre
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = usuario.nombre;
        celdaNombre.className = "fw-bold";

        // Crear celda de edad
        const celdaEdad = document.createElement("td");
        celdaEdad.textContent = usuario.edad;
        celdaEdad.className = "text-center";

        // Crear celda de rol
        const celdaRol = document.createElement("td");
        celdaRol.className = "text-center";
        const badgeRol = document.createElement("span");
        badgeRol.className = usuario.rol === "Administrador" 
            ? "badge bg-danger" 
            : "badge bg-secondary";
        badgeRol.textContent = usuario.rol;
        celdaRol.appendChild(badgeRol);

        // Crear celda de estado
        const celdaEstado = document.createElement("td");
        celdaEstado.className = "text-center";
        const badgeEstado = document.createElement("span");
        badgeEstado.className = usuario.activo 
            ? "badge bg-success" 
            : "badge bg-warning text-dark";
        badgeEstado.textContent = usuario.activo ? "Activo" : "Inactivo";
        celdaEstado.appendChild(badgeEstado);

        // Crear celda de acciones
        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "text-center";

        // Botón cambiar estado
        const btnEstado = document.createElement("button");
        btnEstado.className = "btn btn-sm " + (usuario.activo ? "btn-warning" : "btn-success");
        btnEstado.textContent = usuario.activo ? "Desactivar" : "Activar";
        btnEstado.title = usuario.activo ? "Desactivar usuario" : "Activar usuario";
        btnEstado.addEventListener("click", () => cambiarEstado(index));

        // Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm btn-danger ms-2";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.title = "Eliminar usuario";
        btnEliminar.addEventListener("click", () => eliminarUsuario(index));

        // Agregar botones a la celda
        celdaAcciones.appendChild(btnEstado);
        celdaAcciones.appendChild(btnEliminar);

        // Agregar celdas a la fila
        fila.appendChild(celdaIndice);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaEdad);
        fila.appendChild(celdaRol);
        fila.appendChild(celdaEstado);
        fila.appendChild(celdaAcciones);

        // Agregar fila a la tabla
        tablaUsuarios.appendChild(fila);
    });
}

// ============================================================
// FUNCIÓN: agregarUsuario()
// Valida y agrega un nuevo usuario al arreglo
// Validaciones: campos no vacíos y edad > 0
// ============================================================
function agregarUsuario(evento) {
    evento.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const rol = document.getElementById("rol").value;

    // Limpiar mensajes de error
    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorEdad").textContent = "";

    // Validación 1: Nombre no vacío
    if (nombre === "") {
        document.getElementById("errorNombre").textContent = "El nombre es requerido";
        return;
    }

    // Validación 2: Edad válida (mayor a 0)
    if (edad <= 0 || isNaN(edad)) {
        document.getElementById("errorEdad").textContent = "La edad debe ser mayor a 0";
        return;
    }

    // Validación 3: Rol seleccionado
    if (rol === "") {
        alert("Por favor selecciona un rol");
        return;
    }

    // Crear objeto usuario
    const nuevoUsuario = {
        nombre: nombre,
        edad: edad,
        rol: rol,
        activo: true
    };

    // Agregar usuario al arreglo
    usuarios.push(nuevoUsuario);

    // Limpiar formulario
    document.getElementById("formularioUsuario").reset();

    // Resetear filtro a "todos"
    filtroActual = "todos";
    actualizarBotonessFiltro();

    // Actualizar tabla y estadísticas
    aplicarFiltro(filtroActual);
    actualizarEstadisticas();

    // Mostrar mensaje de éxito (opcional)
    console.log("✓ Usuario agregado correctamente:", nuevoUsuario);
}

// ============================================================
// FUNCIÓN: cambiarEstado(index)
// Alterna el valor booleano de 'activo' para un usuario
// Parámetros: index - índice del usuario en el arreglo
// ============================================================
function cambiarEstado(index) {
    // Validar que el índice existe
    if (index >= 0 && index < usuarios.length) {
        // Alternar estado
        usuarios[index].activo = !usuarios[index].activo;

        // Actualizar tabla y estadísticas
        aplicarFiltro(filtroActual);
        actualizarEstadisticas();

        // Log para confirmar cambio
        console.log(`✓ Estado del usuario "${usuarios[index].nombre}" cambiado a: ${usuarios[index].activo}`);
    }
}

// ============================================================
// FUNCIÓN: eliminarUsuario(index)
// Elimina un usuario del arreglo por su índice
// Parámetros: index - índice del usuario a eliminar
// ============================================================
function eliminarUsuario(index) {
    // Confirmar eliminación
    const usuario = usuarios[index];
    if (confirm(`¿Estás seguro de que deseas eliminar a "${usuario.nombre}"?`)) {
        usuarios.splice(index, 1);

        // Actualizar tabla y estadísticas
        aplicarFiltro(filtroActual);
        actualizarEstadisticas();

        // Log para confirmar eliminación
        console.log(`✓ Usuario "${usuario.nombre}" eliminado correctamente`);
    }
}

// ============================================================
// FUNCIÓN: filtrarUsuarios(tipo)
// Filtra usuarios por rol usando .filter()
// Tipos: "todos", "administradores", "usuarios"
// Retorna: arreglo filtrado
// ============================================================
function filtrarUsuarios(tipo) {
    switch (tipo.toLowerCase()) {
        case "administradores":
            return usuarios.filter(usuario => usuario.rol === "Administrador");
        case "usuarios":
            return usuarios.filter(usuario => usuario.rol === "Usuario");
        case "todos":
        default:
            return usuarios;
    }
}

// ============================================================
// FUNCIÓN: aplicarFiltro(tipo)
// Aplica el filtro y actualiza la tabla
// Parámetros: tipo - "todos", "administradores", "usuarios"
// ============================================================
function aplicarFiltro(tipo) {
    filtroActual = tipo;
    let usuariosFiltrados = filtrarUsuarios(tipo);

    // Si hay orden de edad aplicada, aplicarla también
    if (ordenAscendente !== null) {
        usuariosFiltrados = ordenarPorEdad(usuariosFiltrados);
    }

    renderTable(usuariosFiltrados);
}

// ============================================================
// FUNCIÓN: ordenarPorEdad(datos)
// Ordena usuarios por edad (ascendente o descendente)
// Parámetros: datos - arreglo de usuarios a ordenar
// ============================================================
function ordenarPorEdad(datos) {
    // Crear copia del arreglo para no modificar el original
    const copia = [...datos];

    // Ordenar usando sort()
    copia.sort((a, b) => {
        if (ordenAscendente) {
            return a.edad - b.edad;  // Ascendente
        } else {
            return b.edad - a.edad;  // Descendente
        }
    });

    return copia;
}

// ============================================================
// FUNCIÓN: actualizarEstadisticas()
// Actualiza el panel de conteos (activos e inactivos)
// ============================================================
function actualizarEstadisticas() {
    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(usuario => usuario.activo).length;
    const usuariosInactivos = totalUsuarios - usuariosActivos;

    // Actualizar elementos HTML
    document.getElementById("totalUsuarios").textContent = totalUsuarios;
    document.getElementById("usuariosActivos").textContent = usuariosActivos;
    document.getElementById("usuariosInactivos").textContent = usuariosInactivos;
}

// ============================================================
// FUNCIÓN: actualizarBotonessFiltro()
// Actualiza el estado visual de los botones de filtro
// ============================================================
function actualizarBotonessFiltro() {
    const botonessFiltro = document.querySelectorAll(".btn-group .btn");
    botonessFiltro.forEach(boton => {
        boton.classList.remove("active");
        if (boton.getAttribute("data-filtro") === filtroActual) {
            boton.classList.add("active");
        }
    });
}

// ============================================================
// EVENT LISTENERS - Inicialización de eventos
// ============================================================

// Evento para agregar usuario (submit del formulario)
document.getElementById("formularioUsuario").addEventListener("submit", agregarUsuario);

// Eventos para botones de filtro
document.querySelectorAll(".btn-group .btn").forEach(boton => {
    boton.addEventListener("click", () => {
        const filtro = boton.getAttribute("data-filtro");
        aplicarFiltro(filtro);
        actualizarBotonessFiltro();
    });
});

// Evento para botón de ordenar por edad
document.getElementById("btnOrdenarEdad").addEventListener("click", () => {
    // Alternar entre ascendente y descendente
    ordenAscendente = !ordenAscendente;

    // Actualizar texto del botón
    const btnOrdenar = document.getElementById("btnOrdenarEdad");
    if (ordenAscendente) {
        btnOrdenar.innerHTML = '<i class="bi bi-sort-up"></i> Ordenar por Edad (Ascendente)';
    } else {
        btnOrdenar.innerHTML = '<i class="bi bi-sort-down"></i> Ordenar por Edad (Descendente)';
    }

    // Aplicar filtro (que también aplica orden)
    aplicarFiltro(filtroActual);
});

// ============================================================
// INICIALIZACIÓN - Se ejecuta cuando el DOM está cargado
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // Renderizar tabla inicial
    renderTable(usuarios);

    // Actualizar estadísticas iniciales
    actualizarEstadisticas();

    console.log("✓ Aplicación inicializada correctamente");
});
