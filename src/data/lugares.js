// Lista de lugares base
const lugaresBase = [
  { id: "plano-pureza", nombre: "Plano de Pureza" },
  { id: "astral-superior", nombre: "Astral Superior" },
  { id: "macro-cosmos", nombre: "Macro Cosmos" },
  { id: "planeta-tierra", nombre: "Planeta Tierra" },
  { id: "micro-cosmos", nombre: "Micro Cosmos" },
  { id: "cuerpo-humano", nombre: "Cuerpo Humano" },
  { id: "astral-inferior", nombre: "Astral Inferior" },
];

// Función para inicializar lugar con estructura completa
const inicializarLugar = (lugar) => ({
  ...lugar,
  imagen: lugar.imagen || null
});

// Cargar lugares personalizados desde localStorage
export const cargarLugaresPersonalizados = () => {
  try {
    const guardados = localStorage.getItem('lugaresPersonalizados');
    if (guardados) {
      return JSON.parse(guardados);
    }
  } catch (e) {
    console.error('Error al cargar lugares personalizados:', e);
  }
  return [];
};

// Guardar lugares personalizados en localStorage
export const guardarLugaresPersonalizados = (lugares) => {
  try {
    localStorage.setItem('lugaresPersonalizados', JSON.stringify(lugares));
  } catch (e) {
    console.error('Error al guardar lugares personalizados:', e);
  }
};

// Cargar modificaciones de lugares base (imágenes)
export const cargarModificacionesLugares = () => {
  try {
    const guardadas = localStorage.getItem('modificacionesLugares');
    if (guardadas) {
      return JSON.parse(guardadas);
    }
  } catch (e) {
    console.error('Error al cargar modificaciones de lugares:', e);
  }
  return {};
};

// Guardar modificaciones de lugares base
export const guardarModificacionesLugares = (modificaciones) => {
  try {
    localStorage.setItem('modificacionesLugares', JSON.stringify(modificaciones));
  } catch (e) {
    console.error('Error al guardar modificaciones de lugares:', e);
  }
};

// Obtener todos los lugares (base + personalizados + modificaciones)
export const obtenerTodosLosLugares = () => {
  const personalizados = cargarLugaresPersonalizados();
  const modificaciones = cargarModificacionesLugares();
  
  // Aplicar modificaciones a lugares base
  const lugaresConModificaciones = lugaresBase.map(lugar => {
    const modificacion = modificaciones[lugar.id];
    if (modificacion) {
      return {
        ...lugar,
        imagen: modificacion.imagen !== undefined ? modificacion.imagen : null
      };
    }
    return inicializarLugar(lugar);
  });
  
  return [...lugaresConModificaciones, ...personalizados];
};

// Crear un mapa por ID para búsqueda rápida
export const lugaresPorId = obtenerTodosLosLugares().reduce((acc, lugar) => {
  acc[lugar.id] = lugar;
  return acc;
}, {});

