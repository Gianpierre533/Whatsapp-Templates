const CLAVE = "whatsapp-templates";
const CLAVE_FILTRO = "whatsapp-templates-filtro";
const CLAVE_VISITAS = "whatsapp-templates-visitas"; // LOGRO 2: Nueva clave

// LOGRO 2: Función que cuenta y guarda las visitas
function registrarVisita() {
  let visitas = Number(localStorage.getItem(CLAVE_VISITAS)) || 0;
  visitas += 1;
  localStorage.setItem(CLAVE_VISITAS, visitas);
  return visitas;
}

// Ejecutamos el registro apenas carga el archivo
const totalVisitas = registrarVisita(); 

function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) return [];
  
  try {
    return JSON.parse(guardado);
  } catch (error) {
    console.warn("Datos corruptos, empiezo de cero:", error);
    return [];
  }
}

function guardar() {
  state.plantillas.length === 0
    ? localStorage.removeItem(CLAVE)
    : localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));
    
  localStorage.setItem(CLAVE_FILTRO, state.filtro ?? "");

  const indicador = document.getElementById("estado");
  if (indicador) {
    // LOGRO 2: Mostramos el número de visita en la interfaz
    indicador.textContent = state.plantillas.length > 0 
      ? `Guardado ✓ (Visita #${totalVisitas})` 
      : `Vacío (Visita #${totalVisitas})`;
  }
}