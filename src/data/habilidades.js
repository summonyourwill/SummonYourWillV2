// Lista de habilidades base por categoría
const habilidadesBase = {
  espirituales: [
    { id: "meditacion", nombre: "Meditación" },
    { id: "oracion", nombre: "Oración" },
    { id: "visualizacion", nombre: "Visualización" },
    { id: "conexion-divina", nombre: "Conexión Divina" },
  ],
  empoderamiento: [
    { id: "autoestima", nombre: "Autoestima" },
    { id: "confianza", nombre: "Confianza" },
    { id: "fuerza-interior", nombre: "Fuerza Interior" },
    { id: "determinacion", nombre: "Determinación" },
  ],
  "de-materia": [
    { id: "manipulacion-elemental", nombre: "Manipulación Elemental" },
    { id: "telekinesis", nombre: "Telekinesis" },
    { id: "transformacion", nombre: "Transformación" },
    { id: "creacion", nombre: "Creación" },
  ]
};

// Función para inicializar habilidad con estructura completa
const inicializarHabilidad = (habilidad) => ({
  ...habilidad,
  imagen: habilidad.imagen || null
});

// Cargar habilidades personalizadas desde localStorage
export const cargarHabilidadesPersonalizadas = () => {
  try {
    const guardadas = localStorage.getItem('habilidadesPersonalizadas');
    if (guardadas) {
      return JSON.parse(guardadas);
    }
  } catch (e) {
    console.error('Error al cargar habilidades personalizadas:', e);
  }
  return [];
};

// Guardar habilidades personalizadas en localStorage
export const guardarHabilidadesPersonalizadas = (habilidades) => {
  try {
    localStorage.setItem('habilidadesPersonalizadas', JSON.stringify(habilidades));
  } catch (e) {
    console.error('Error al guardar habilidades personalizadas:', e);
  }
};

// Cargar modificaciones de habilidades base (imágenes)
export const cargarModificacionesHabilidades = () => {
  try {
    const guardadas = localStorage.getItem('modificacionesHabilidades');
    if (guardadas) {
      return JSON.parse(guardadas);
    }
  } catch (e) {
    console.error('Error al cargar modificaciones de habilidades:', e);
  }
  return {};
};

// Guardar modificaciones de habilidades base
export const guardarModificacionesHabilidades = (modificaciones) => {
  try {
    localStorage.setItem('modificacionesHabilidades', JSON.stringify(modificaciones));
  } catch (e) {
    console.error('Error al guardar modificaciones de habilidades:', e);
  }
};

// Obtener todas las habilidades (base + personalizadas + modificaciones)
export const obtenerTodasLasHabilidades = () => {
  const personalizadas = cargarHabilidadesPersonalizadas();
  const modificaciones = cargarModificacionesHabilidades();
  
  // Convertir estructura de habilidades base a array plano
  const habilidadesArray = [];
  
  Object.keys(habilidadesBase).forEach(categoria => {
    habilidadesBase[categoria].forEach(habilidad => {
      const modificacion = modificaciones[habilidad.id];
      if (modificacion) {
        habilidadesArray.push({
          ...habilidad,
          categoria: categoria,
          imagen: modificacion.imagen !== undefined ? modificacion.imagen : null
        });
      } else {
        habilidadesArray.push({
          ...inicializarHabilidad(habilidad),
          categoria: categoria
        });
      }
    });
  });
  
  return [...habilidadesArray, ...personalizadas];
};

// Obtener habilidades por categoría
export const obtenerHabilidadesPorCategoria = () => {
  const todas = obtenerTodasLasHabilidades();
  const porCategoria = {
    espirituales: [],
    empoderamiento: [],
    "de-materia": []
  };
  
  todas.forEach(habilidad => {
    const categoria = habilidad.categoria || 'espirituales';
    if (porCategoria[categoria]) {
      porCategoria[categoria].push(habilidad);
    } else {
      porCategoria.espirituales.push(habilidad);
    }
  });
  
  return porCategoria;
};

// Crear un mapa por ID para búsqueda rápida
export const habilidadesPorId = obtenerTodasLasHabilidades().reduce((acc, habilidad) => {
  acc[habilidad.id] = habilidad;
  return acc;
}, {});

// Obtener nombre de categoría en español
export const getNombreCategoria = (categoria) => {
  const nombres = {
    "espirituales": "Espirituales",
    "empoderamiento": "Empoderamiento",
    "de-materia": "De Materia"
  };
  return nombres[categoria] || categoria;
};

