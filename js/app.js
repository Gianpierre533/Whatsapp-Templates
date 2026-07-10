const state = { plantillas: [] };          // ← la única fuente de verdad

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva);   // agrega la nueva plantilla al estado
}

const lista = document.getElementById("listaPlantillas");

// --- HU4: Función derivada para filtrar plantillas ---
function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  if (filtroTexto === "") return state.plantillas;
  return state.plantillas.filter(plantilla => plantilla.hashtag.toLowerCase().includes(filtroTexto));
}

// --- HU3: Estadísticas - Función Pura ---
function contarPorHashtag(plantillas) {
  const conteo = {};                              // "caja" vacía
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;  // si ya existe, suma 1
    } else {
      conteo[elHashtag] = 1;                      // si es nuevo, empieza en 1
    }
  });
  return conteo;
}

function renderStats() {
  const total = state.plantillas.length;
  const porTag = contarPorHashtag(state.plantillas);
  const etiquetas = Object.entries(porTag)
    .map(([hashtag, cantidad]) =>
      `<span class="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full">${hashtag} · ${cantidad}</span>`)
    .join("");
    
  // LOGRO 2: Calcular el hashtag más usado
  let masUsadoHTML = "";
  if (total > 0) {
    const masUsado = Object.entries(porTag).sort((a, b) => b[1] - a[1])[0];
    masUsadoHTML = `<div class="w-full mt-2 text-xs font-medium text-emerald-700">🏆 Hashtag más popular: ${masUsado[0]}</div>`;
  }

  document.getElementById("panel-stats").innerHTML = `
    <div class="flex items-center gap-2 flex-wrap">
      <span class="text-sm font-semibold text-slate-700">${total} plantilla(s)</span>
      ${etiquetas}
    </div>
    ${masUsadoHTML}`; // ← Se agrega el HTML del logro 2
}

function render() {
  lista.innerHTML = "";                       // 1. limpia lo anterior
  plantillasVisibles().forEach(function (plantilla) {
    const fechaTexto = plantilla.fecha.toLocaleDateString("es-PE");   // Date → texto legible
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded-lg shadow";
    // HU1 y HU2: Se agregaron los botones de Editar y Eliminar con data-id
    li.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <strong class="text-slate-800">${plantilla.titulo}</strong>
        <span class="text-xs text-slate-400 shrink-0">${fechaTexto}</span>
      </div>
      <p class="text-sm text-slate-600 mt-1">${plantilla.mensaje}</p>
      <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>
      <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">
        <button class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition" data-id="${plantilla.id}">Editar</button>
        <button class="btn-eliminar text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition" data-id="${plantilla.id}">Eliminar</button>
      </div>`;
    lista.appendChild(li);                     // 2. agrega un nodo por dato
  });
  
  renderSelector(); 
  renderStats(); // HU3: Mantener las estadísticas actualizadas al final del render
}

const form = document.getElementById("form-plantilla");
const titulo = document.getElementById("titulo");
const mensaje = document.getElementById("mensaje");
const hashtag = document.getElementById("hashtag");

// LOGRO 1: Capturamos los botones nuevos para el modo edición
const btnSubmit = document.getElementById("btn-submit");
const btnCancelar = document.getElementById("btn-cancelar");

function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();           // sin espacios, en minúscula
  return limpio.startsWith("#") ? limpio : "#" + limpio; // asegura el #
}

// LOGRO 1: Función para resetear el formulario y sus botones
function restaurarFormulario() {
  form.reset();
  state.editandoId = null;
  btnCancelar.classList.add("hidden");
  btnSubmit.textContent = "Agregar plantilla";
  btnSubmit.classList.replace("bg-blue-600", "bg-emerald-600");
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const tituloTexto = titulo.value.trim();
  const mensajeTexto = mensaje.value.trim();

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {              // validación
    alert("Título y mensaje son obligatorios");
    return;
  }

  // HU2: Modificar comportamiento del submit para crear o editar
  if (state.editandoId) {
    state.plantillas = state.plantillas.map(plantilla =>     // actualiza solo esa, sin mutar
      plantilla.id === state.editandoId ? { ...plantilla, titulo: tituloTexto, mensaje: mensajeTexto, hashtag: normalizarHashtag(hashtag.value) } : plantilla
    );
    // state.editandoId = null; (Lo manejamos ahora en restaurarFormulario)
  } else {
    agregarPlantilla(tituloTexto, mensajeTexto, normalizarHashtag(hashtag.value));
  }
  
  render();
  restaurarFormulario(); // LOGRO 1: Reemplaza a form.reset()
});

// LOGRO 1: Evento para el botón cancelar
btnCancelar.addEventListener("click", restaurarFormulario);

// --- HU1 y HU2: Delegación de eventos para Eliminar y Editar ---
function eliminarPlantilla(id) {
  state.plantillas = state.plantillas.filter(plantilla => plantilla.id !== id);  // sin mutar: filtra
  render();
}

function cargarEnFormulario(id) {
  const plantilla = state.plantillas.find(plantilla => plantilla.id === id);
  titulo.value = plantilla.titulo;
  mensaje.value = plantilla.mensaje;
  hashtag.value = plantilla.hashtag;
  state.editandoId = id;          // recordamos que estamos editando, no creando
  
  // LOGRO 1: Cambiar la apariencia para modo edición
  btnCancelar.classList.remove("hidden");
  btnSubmit.textContent = "Guardar cambios";
  btnSubmit.classList.replace("bg-emerald-600", "bg-blue-600");
}

lista.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;
  
  // LOGRO 3: Confirmación simple antes de borrar
  if (evento.target.classList.contains("btn-eliminar")) {
    if (confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) {
      eliminarPlantilla(id);
    }
  }
  
  if (evento.target.classList.contains("btn-editar"))   cargarEnFormulario(id);
});

// --- HU4: Escuchador del Buscador ---
document.getElementById("buscador").addEventListener("input", function (evento) {
  state.filtro = evento.target.value;   // el filtro vive en el estado
  render();                             // mismo render, datos distintos
});

// --- Lab 13: Usar la plantilla — generador de mensaje ---

function generarMensajeFinal(plantilla, valorNombre) {
  return plantilla.mensaje.replaceAll("{nombre}", valorNombre);
}

const selector = document.getElementById("selector");

function renderSelector() {
  selector.innerHTML = state.plantillas
    .map((plantilla, indice) => `<option value="${indice}">${plantilla.titulo}</option>`)   // value = posición en el array
    .join("");
}

const salida = document.getElementById("mensaje-final");

document.getElementById("btn-generar").addEventListener("click", function () {
  if(state.plantillas.length === 0) return; // Validación por si no hay plantillas
  const plantilla = state.plantillas[Number(selector.value)];   // la elegida en el select
  const nombre = document.getElementById("valorNombre").value.trim();
  salida.textContent = generarMensajeFinal(plantilla, nombre);
});

document.getElementById("btn-copiar").addEventListener("click", function () {
  navigator.clipboard.writeText(salida.textContent);
});