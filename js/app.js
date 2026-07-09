const state = { plantillas: [] };          // ← la única fuente de verdad

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva);   // agrega la nueva plantilla al estado
}

const lista = document.getElementById("listaPlantillas");

function render() {
  lista.innerHTML = "";                       // 1. limpia lo anterior
  state.plantillas.forEach(function (plantilla) {
    const fechaTexto = plantilla.fecha.toLocaleDateString("es-PE");   // Date → texto legible
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded-lg shadow";
    li.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <strong class="text-slate-800">${plantilla.titulo}</strong>
        <span class="text-xs text-slate-400 shrink-0">${fechaTexto}</span>
      </div>
      <p class="text-sm text-slate-600 mt-1">${plantilla.mensaje}</p>
      <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>`;
    lista.appendChild(li);                     // 2. agrega un nodo por dato
  });
  
  renderSelector(); // ← agregado para mantener el select actualizado
}

const form = document.getElementById("form-plantilla");

function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();           // sin espacios, en minúscula
  return limpio.startsWith("#") ? limpio : "#" + limpio; // asegura el #
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const tituloTexto = titulo.value.trim();
  const mensajeTexto = mensaje.value.trim();

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {              // validación
    alert("Título y mensaje son obligatorios");
    return;
  }
  agregarPlantilla(tituloTexto, mensajeTexto, normalizarHashtag(hashtag.value));
  render();
  form.reset();
});

// --- HU4: Usar la plantilla — generador de mensaje ---

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
  const plantilla = state.plantillas[Number(selector.value)];   // la elegida en el select
  const nombre = document.getElementById("valorNombre").value.trim();
  salida.textContent = generarMensajeFinal(plantilla, nombre);
});

document.getElementById("btn-copiar").addEventListener("click", function () {
  navigator.clipboard.writeText(salida.textContent);
});