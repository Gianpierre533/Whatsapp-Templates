import { state } from "./state.js";
import { cargar, CLAVE_FILTRO } from "./storage.js";
import { render } from "./ui.js";

// Inicialización de la app
state.plantillas = cargar();
state.filtro = localStorage.getItem(CLAVE_FILTRO) ?? "";

document.getElementById("buscador").value = state.filtro;
render();