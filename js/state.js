export const state = {
  plantillas: [],
  editandoId: null,
  filtro: "",
  orden: "recientes" // HU4: Estado por defecto del orden
};

// HU4 y LOGRO 2: Función para ordenar (alfabético incluido)
export function ordenar(plantillas) {
  const copia = [...plantillas]; // Inmutabilidad: no mutar el original
  if (state.orden === "antiguas") return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  if (state.orden === "alfabetico") return copia.sort((a, b) => a.titulo.localeCompare(b.titulo));
  return copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // recientes por defecto
}

export function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  const filtradas = filtroTexto === ""
    ? state.plantillas
    : state.plantillas.filter(plantilla => plantilla.hashtag.toLowerCase().includes(filtroTexto));
  return ordenar(filtradas); // Filtramos y luego ordenamos
}

export function contarPorHashtag(plantillas) {
  const conteo = {};
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    conteo[elHashtag] = conteo[elHashtag] ? conteo[elHashtag] + 1 : 1;
  });
  return conteo;
}

export function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();
  return limpio.startsWith("#") ? limpio : "#" + limpio;
}