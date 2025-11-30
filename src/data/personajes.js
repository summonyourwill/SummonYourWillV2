// Función para inicializar personaje con estructura completa
const inicializarPersonaje = (personaje) => ({
  ...personaje,
  imagen: personaje.imagen || null,
  misiones: personaje.misiones || []
});

// Lista completa de personajes base
const personajesBase = [
  // Dios
  { id: "dios", nombre: "Dios", tipo: "dios" },
  
  // Yo
  { id: "fabian", nombre: "Fabián", tipo: "yo" },
  
  // Maestros
  { id: "jesus", nombre: "Jesús", tipo: "maestro" },
  { id: "buda", nombre: "Buda", tipo: "maestro" },
  { id: "ganesha", nombre: "Ganesha", tipo: "maestro" },
  { id: "krishna", nombre: "Krishna", tipo: "maestro" },
  { id: "maria", nombre: "María", tipo: "maestro" },
  
  // Guías
  { id: "conciencia", nombre: "Conciencia", tipo: "guia" },
  { id: "voluntad", nombre: "Voluntad", tipo: "guia" },
  { id: "equilibrio", nombre: "Equilibrio", tipo: "guia" },
  { id: "amor", nombre: "Amor", tipo: "guia" },
  { id: "luz", nombre: "Luz", tipo: "guia" },
  { id: "autocuidado", nombre: "Autocuidado", tipo: "guia" },
  { id: "tecnologia", nombre: "Tecnología", tipo: "guia" },
  { id: "hierro", nombre: "Hierro", tipo: "guia" },
  { id: "salud", nombre: "Salud", tipo: "guia" },
  { id: "valiente", nombre: "Valiente", tipo: "guia" },
  { id: "optimista", nombre: "Optimista", tipo: "guia" },
  { id: "maestra-cumbres", nombre: "Maestra de las Cumbres", tipo: "guia" },
  { id: "gemelos", nombre: "Gemelos", tipo: "guia" },
  { id: "guardian-mar", nombre: "Guardián del Mar", tipo: "guia" },
  { id: "guia-playa-dia", nombre: "Guía de la Playa Día", tipo: "guia" },
  { id: "guia-playa-noche", nombre: "Guía de la Playa Noche", tipo: "guia" },
  
  // Héroes - Avatar
  { id: "aang", nombre: "Aang", tipo: "heroe", grupo: "Avatar" },
  { id: "katara", nombre: "Katara", tipo: "heroe", grupo: "Avatar" },
  { id: "sokka", nombre: "Sokka", tipo: "heroe", grupo: "Avatar" },
  { id: "toph", nombre: "Toph", tipo: "heroe", grupo: "Avatar" },
  { id: "zuko", nombre: "Zuko", tipo: "heroe", grupo: "Avatar" },
  { id: "korra", nombre: "Korra", tipo: "heroe", grupo: "Avatar" },
  
  // Héroes - Dragon Ball
  { id: "goku", nombre: "Goku", tipo: "heroe", grupo: "Dragon Ball" },
  { id: "vegeta", nombre: "Vegeta", tipo: "heroe", grupo: "Dragon Ball" },
  { id: "gohan", nombre: "Gohan", tipo: "heroe", grupo: "Dragon Ball" },
  { id: "trunks", nombre: "Trunks", tipo: "heroe", grupo: "Dragon Ball" },
  { id: "piccolo", nombre: "Piccolo", tipo: "heroe", grupo: "Dragon Ball" },
  
  // Héroes - Naruto
  { id: "naruto", nombre: "Naruto", tipo: "heroe", grupo: "Naruto" },
  { id: "sasuke", nombre: "Sasuke", tipo: "heroe", grupo: "Naruto" },
  { id: "sakura", nombre: "Sakura", tipo: "heroe", grupo: "Naruto" },
  { id: "kakashi", nombre: "Kakashi", tipo: "heroe", grupo: "Naruto" },
  { id: "hinata", nombre: "Hinata", tipo: "heroe", grupo: "Naruto" },
  { id: "gaara", nombre: "Gaara", tipo: "heroe", grupo: "Naruto" },
  
  // Héroes - Sailor Moon
  { id: "sailor-moon", nombre: "Sailor Moon", tipo: "heroe", grupo: "Sailor Moon" },
  { id: "sailor-mercury", nombre: "Sailor Mercury", tipo: "heroe", grupo: "Sailor Moon" },
  { id: "sailor-mars", nombre: "Sailor Mars", tipo: "heroe", grupo: "Sailor Moon" },
  { id: "sailor-jupiter", nombre: "Sailor Jupiter", tipo: "heroe", grupo: "Sailor Moon" },
  { id: "sailor-venus", nombre: "Sailor Venus", tipo: "heroe", grupo: "Sailor Moon" },
  { id: "sailor-saturn", nombre: "Sailor Saturn", tipo: "heroe", grupo: "Sailor Moon" },
  
  // Héroes - Winx
  { id: "bloom", nombre: "Bloom", tipo: "heroe", grupo: "Winx" },
  { id: "stella", nombre: "Stella", tipo: "heroe", grupo: "Winx" },
  { id: "flora", nombre: "Flora", tipo: "heroe", grupo: "Winx" },
  { id: "musa", nombre: "Musa", tipo: "heroe", grupo: "Winx" },
  { id: "tecna", nombre: "Tecna", tipo: "heroe", grupo: "Winx" },
  { id: "aisha", nombre: "Aisha", tipo: "heroe", grupo: "Winx" },
  
  // Héroes - Caballeros del Zodiaco
  { id: "seiya", nombre: "Seiya", tipo: "heroe", grupo: "Caballeros del Zodiaco" },
  { id: "shiryu", nombre: "Shiryu", tipo: "heroe", grupo: "Caballeros del Zodiaco" },
  { id: "hyoga", nombre: "Hyoga", tipo: "heroe", grupo: "Caballeros del Zodiaco" },
  { id: "shun", nombre: "Shun", tipo: "heroe", grupo: "Caballeros del Zodiaco" },
  { id: "ikki", nombre: "Ikki", tipo: "heroe", grupo: "Caballeros del Zodiaco" },
].map(inicializarPersonaje);

// Cargar personajes personalizados desde localStorage
export const cargarPersonajesPersonalizados = () => {
  try {
    const guardados = localStorage.getItem('personajesPersonalizados');
    if (guardados) {
      return JSON.parse(guardados);
    }
  } catch (e) {
    console.error('Error al cargar personajes personalizados:', e);
  }
  return [];
};

// Guardar personajes personalizados en localStorage
export const guardarPersonajesPersonalizados = (personajes) => {
  try {
    localStorage.setItem('personajesPersonalizados', JSON.stringify(personajes));
  } catch (e) {
    console.error('Error al guardar personajes personalizados:', e);
  }
};

// Cargar modificaciones de personajes base (imágenes y misiones)
export const cargarModificacionesPersonajes = () => {
  try {
    const guardadas = localStorage.getItem('modificacionesPersonajes');
    if (guardadas) {
      return JSON.parse(guardadas);
    }
  } catch (e) {
    console.error('Error al cargar modificaciones:', e);
  }
  return {};
};

// Guardar modificaciones de personajes base
export const guardarModificacionesPersonajes = (modificaciones) => {
  try {
    localStorage.setItem('modificacionesPersonajes', JSON.stringify(modificaciones));
  } catch (e) {
    console.error('Error al guardar modificaciones:', e);
  }
};

// Obtener todos los personajes (base + personalizados + modificaciones)
export const obtenerTodosLosPersonajes = () => {
  const personalizados = cargarPersonajesPersonalizados();
  const modificaciones = cargarModificacionesPersonajes();
  
  // Aplicar modificaciones a personajes base
  const personajesConModificaciones = personajesBase.map(personaje => {
    const modificacion = modificaciones[personaje.id];
    if (modificacion) {
      return {
        ...personaje,
        imagen: modificacion.imagen !== undefined ? modificacion.imagen : personaje.imagen,
        misiones: modificacion.misiones !== undefined ? modificacion.misiones : personaje.misiones
      };
    }
    return personaje;
  });
  
  return [...personajesConModificaciones, ...personalizados];
};

// Lista completa de personajes (para compatibilidad)
export const personajes = obtenerTodosLosPersonajes();

// Crear un mapa por ID para búsqueda rápida
export const personajesPorId = obtenerTodosLosPersonajes().reduce((acc, personaje) => {
  acc[personaje.id] = personaje;
  return acc;
}, {});

// Función para obtener el orden de prioridad de tipos
export const getTipoOrden = (tipo) => {
  const orden = {
    "dios": 1,
    "yo": 2,
    "maestro": 3,
    "guia": 4,
    "heroe": 5,
  };
  return orden[tipo] || 99;
};

// Función para ordenar personajes
export const ordenarPersonajes = (personajes) => {
  return [...personajes].sort((a, b) => {
    const ordenA = getTipoOrden(a.tipo);
    const ordenB = getTipoOrden(b.tipo);
    if (ordenA !== ordenB) {
      return ordenA - ordenB;
    }
    return a.nombre.localeCompare(b.nombre);
  });
};

