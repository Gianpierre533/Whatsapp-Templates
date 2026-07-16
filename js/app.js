const state = { 
  plantillas: cargar(), 
  editandoId: null,
  filtro: localStorage.getItem(CLAVE_FILTRO) ?? "" 
}; 

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva); 
}

const lista = document.getElementById("listaPlantillas");

function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  if (filtroTexto === "") return state.plantillas;
  return state.plantillas.filter(plantilla => plantilla.hashtag.toLowerCase().includes(filtroTexto));
}

function contarPorHashtag(plantillas) {
  const conteo = {};                              
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;  
    } else {
      conteo[elHashtag] = 1;                      
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
    ${masUsadoHTML}`; 
}

function render() {
  lista.innerHTML = "";                       
  plantillasVisibles().forEach(function (plantilla) {
    const fechaCreacion = new Date(plantilla.fecha).toLocaleDateString("es-PE"); 
    
    // LOGRO 3: Modificamos el texto si la plantilla tiene una fecha de edición
    const textoFecha = plantilla.editadaEl 
      ? `${fechaCreacion} (Editada)` 
      : fechaCreacion;
    
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded-lg shadow";
    li.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <strong class="text-slate-800">${plantilla.titulo}</strong>
        <!-- Mostramos la variable textoFecha que armamos arriba -->
        <span class="text-xs text-slate-400 shrink-0">${textoFecha}</span>
      </div>
      <p class="text-sm text-slate-600 mt-1">${plantilla.mensaje}</p>
      <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>
      <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">
        <button class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition" data-id="${plantilla.id}">Editar</button>
        <button class="btn-eliminar text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition" data-id="${plantilla.id}">Eliminar</button>
      </div>`;
    lista.appendChild(li);                     
  });
  
  renderSelector(); 
  renderStats(); 
  guardar(); 
}

const form = document.getElementById("form-plantilla");
const titulo = document.getElementById("titulo");
const mensaje = document.getElementById("mensaje");
const hashtag = document.getElementById("hashtag");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelar = document.getElementById("btn-cancelar");

function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();           
  return limpio.startsWith("#") ? limpio : "#" + limpio; 
}

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

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {              
    alert("Título y mensaje son obligatorios");
    return;
  }

  if (state.editandoId) {
    state.plantillas = state.plantillas.map(plantilla =>     
      plantilla.id === state.editandoId ? { 
        ...plantilla, 
        titulo: tituloTexto, 
        mensaje: mensajeTexto, 
        hashtag: normalizarHashtag(hashtag.value),
        editadaEl: new Date() // LOGRO 3: Registramos la fecha de edición
      } : plantilla
    );
  } else {
    agregarPlantilla(tituloTexto, mensajeTexto, normalizarHashtag(hashtag.value));
  }
  
  render();
  restaurarFormulario(); 
});

btnCancelar.addEventListener("click", restaurarFormulario);

function eliminarPlantilla(id) {
  state.plantillas = state.plantillas.filter(plantilla => plantilla.id !== id);  
  render();
}

function cargarEnFormulario(id) {
  const plantilla = state.plantillas.find(plantilla => plantilla.id === id);
  titulo.value = plantilla.titulo;
  mensaje.value = plantilla.mensaje;
  hashtag.value = plantilla.hashtag;
  state.editandoId = id;          
  
  btnCancelar.classList.remove("hidden");
  btnSubmit.textContent = "Guardar cambios";
  btnSubmit.classList.replace("bg-emerald-600", "bg-blue-600");
}

lista.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;
  if (evento.target.classList.contains("btn-eliminar")) {
    if (confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) {
      eliminarPlantilla(id);
    }
  }
  if (evento.target.classList.contains("btn-editar"))   cargarEnFormulario(id);
});

document.getElementById("buscador").addEventListener("input", function (evento) {
  state.filtro = evento.target.value;   
  render();                             
});

function generarMensajeFinal(plantilla, valorNombre) {
  return plantilla.mensaje.replaceAll("{nombre}", valorNombre);
}

const selector = document.getElementById("selector");

function renderSelector() {
  selector.innerHTML = state.plantillas
    .map((plantilla, indice) => `<option value="${indice}">${plantilla.titulo}</option>`)   
    .join("");
}

const salida = document.getElementById("mensaje-final");

document.getElementById("btn-generar").addEventListener("click", function () {
  if(state.plantillas.length === 0) return; 
  const plantilla = state.plantillas[Number(selector.value)];   
  const nombre = document.getElementById("valorNombre").value.trim();
  salida.textContent = generarMensajeFinal(plantilla, nombre);
});

document.getElementById("btn-copiar").addEventListener("click", function () {
  navigator.clipboard.writeText(salida.textContent);
});

document.getElementById("btn-vaciar").addEventListener("click", function () {
  state.plantillas = [];
  render(); 
});

// --- LOGRO 1: Botón Exportar a consola ---
document.getElementById("btn-exportar").addEventListener("click", function() {
  console.log("=== TUS PLANTILLAS GUARDADAS ===");
  // El tercer parámetro "2" le pone sangría bonita (indentación) al texto
  console.log(JSON.stringify(state.plantillas, null, 2));
  alert("¡Datos exportados! Abre la consola del navegador (F12) para verlos.");
});

// --- INICIO DE LA APP ---
document.getElementById("buscador").value = state.filtro; 
render();