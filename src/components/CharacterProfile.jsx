import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  personajesPorId, 
  obtenerTodosLosPersonajes,
  guardarModificacionesPersonajes,
  cargarModificacionesPersonajes,
  guardarPersonajesPersonalizados,
  cargarPersonajesPersonalizados
} from '../data/personajes'
import { useState, useEffect } from 'react'
import AddMissionModal from './AddMissionModal'

function CharacterProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entradas, setEntradas] = useState([])
  const [personaje, setPersonaje] = useState(null)
  const [mostrarModalMision, setMostrarModalMision] = useState(false)
  
  useEffect(() => {
    const todos = obtenerTodosLosPersonajes()
    const encontrado = todos.find(p => p.id === id)
    setPersonaje(encontrado || null)
  }, [id])
  
  // Cargar entradas del localStorage
  useEffect(() => {
    const entradasGuardadas = localStorage.getItem('diarioEntradas')
    if (entradasGuardadas) {
      try {
        setEntradas(JSON.parse(entradasGuardadas))
      } catch (e) {
        console.error('Error al cargar entradas:', e)
      }
    }
  }, [])

  // Actualizar personaje cuando cambian las misiones
  useEffect(() => {
    if (personaje) {
      const todos = obtenerTodosLosPersonajes()
      const actualizado = todos.find(p => p.id === id)
      if (actualizado) {
        setPersonaje(actualizado)
      }
    }
  }, [id])
  
  if (!personaje) {
    return (
      <div className="profile-container">
        <div className="profile-not-found">
          <h2>Personaje no encontrado</h2>
          <Link to="/" className="btn-volver">Volver al Diario</Link>
        </div>
      </div>
    )
  }
  
  // Filtrar entradas que mencionan a este personaje
  const entradasConMencion = entradas.filter(entrada =>
    entrada.mentions?.personajes?.includes(id)
  )
  
  const totalMenciones = entradasConMencion.length
  
  // Función para obtener inicial del nombre
  const getInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase()
  }
  
  // Función para obtener color según tipo
  const getTipoColor = (tipo) => {
    const colores = {
      "dios": "#fbbf24",
      "yo": "#60a5fa",
      "maestro": "#a78bfa",
      "guia": "#34d399",
      "heroe": "#f472b6",
    }
    return colores[tipo] || "#94a3b8"
  }
  
  // Función para obtener descripción según tipo
  const getDescripcion = (tipo) => {
    const descripciones = {
      "dios": "La fuente divina de toda existencia y amor infinito.",
      "yo": "Mi ser esencial, mi verdadero yo.",
      "maestro": "Un maestro espiritual que guía el camino hacia la sabiduría y la iluminación.",
      "guia": "Un guía que ofrece orientación y apoyo en el viaje espiritual.",
      "heroe": "Un héroe que inspira con su valentía, determinación y nobleza.",
    }
    return descripciones[tipo] || "Un ser especial en mi camino espiritual."
  }

  const handleAgregarMision = (nuevaMision) => {
    if (!personaje) return

    const misionesActuales = personaje.misiones || []
    const nuevasMisiones = [...misionesActuales, nuevaMision]

    // Actualizar personaje
    const personajeActualizado = {
      ...personaje,
      misiones: nuevasMisiones
    }

    // Guardar según si es personalizado o base
    if (personaje.id.startsWith('personalizado-')) {
      const personalizados = cargarPersonajesPersonalizados()
      const actualizados = personalizados.map(p => 
        p.id === personaje.id ? personajeActualizado : p
      )
      guardarPersonajesPersonalizados(actualizados)
    } else {
      const modificaciones = cargarModificacionesPersonajes()
      modificaciones[personaje.id] = {
        imagen: personaje.imagen || null,
        misiones: nuevasMisiones
      }
      guardarModificacionesPersonajes(modificaciones)
    }

    setPersonaje(personajeActualizado)
  }

  const handleToggleMision = (misionId) => {
    if (!personaje) return

    const misionesActualizadas = personaje.misiones.map(m => 
      m.id === misionId ? { ...m, completada: !m.completada } : m
    )

    const personajeActualizado = {
      ...personaje,
      misiones: misionesActualizadas
    }

    if (personaje.id.startsWith('personalizado-')) {
      const personalizados = cargarPersonajesPersonalizados()
      const actualizados = personalizados.map(p => 
        p.id === personaje.id ? personajeActualizado : p
      )
      guardarPersonajesPersonalizados(actualizados)
    } else {
      const modificaciones = cargarModificacionesPersonajes()
      modificaciones[personaje.id] = {
        imagen: personaje.imagen || null,
        misiones: misionesActualizadas
      }
      guardarModificacionesPersonajes(modificaciones)
    }

    setPersonaje(personajeActualizado)
  }

  const handleEliminarMision = (misionId) => {
    if (!personaje || !window.confirm('¿Eliminar esta misión?')) return

    const misionesActualizadas = personaje.misiones.filter(m => m.id !== misionId)

    const personajeActualizado = {
      ...personaje,
      misiones: misionesActualizadas
    }

    if (personaje.id.startsWith('personalizado-')) {
      const personalizados = cargarPersonajesPersonalizados()
      const actualizados = personalizados.map(p => 
        p.id === personaje.id ? personajeActualizado : p
      )
      guardarPersonajesPersonalizados(actualizados)
    } else {
      const modificaciones = cargarModificacionesPersonajes()
      modificaciones[personaje.id] = {
        imagen: personaje.imagen || null,
        misiones: misionesActualizadas
      }
      guardarModificacionesPersonajes(modificaciones)
    }

    setPersonaje(personajeActualizado)
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <Link to="/" className="btn-home">🏠 Inicio</Link>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          {personaje.imagen ? (
            <div className="profile-avatar-large">
              <img src={personaje.imagen} alt={personaje.nombre} />
            </div>
          ) : (
            <div className="profile-avatar-large" style={{ backgroundColor: getTipoColor(personaje.tipo) }}>
              {getInicial(personaje.nombre)}
            </div>
          )}
          
          <div className="profile-info">
            <h1 className="profile-name">{personaje.nombre}</h1>
            <div className="profile-badges">
              <span className="badge-tipo">{personaje.tipo}</span>
              {personaje.grupo && (
                <span className="badge-grupo">{personaje.grupo}</span>
              )}
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{totalMenciones}</span>
                <span className="stat-label">
                  {totalMenciones === 1 ? 'Mención' : 'Menciones'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{personaje.misiones?.length || 0}</span>
                <span className="stat-label">
                  {(personaje.misiones?.length || 0) === 1 ? 'Misión' : 'Misiones'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-sections">
          <section className="profile-section">
            <h2>Sobre este ser</h2>
            <p className="profile-description">
              {getDescripcion(personaje.tipo)}
            </p>
            {personaje.grupo && (
              <p className="profile-group-info">
                <strong>Grupo:</strong> {personaje.grupo}
              </p>
            )}
          </section>
          
          <section className="profile-section">
            <div className="section-header-with-button">
              <h2>Misiones</h2>
              <button 
                className="btn-agregar-mision"
                onClick={() => setMostrarModalMision(true)}
              >
                + Agregar Misión
              </button>
            </div>
            {(!personaje.misiones || personaje.misiones.length === 0) ? (
              <p className="no-interactions">
                No hay misiones asignadas a {personaje.nombre} aún.
              </p>
            ) : (
              <div className="misiones-list">
                {personaje.misiones.map(mision => {
                  const fecha = new Date(mision.fechaCreacion)
                  return (
                    <div 
                      key={mision.id} 
                      className={`mision-item ${mision.completada ? 'completada' : ''}`}
                    >
                      <div className="mision-header">
                        <label className="mision-checkbox">
                          <input
                            type="checkbox"
                            checked={mision.completada}
                            onChange={() => handleToggleMision(mision.id)}
                          />
                          <span className="mision-titulo">{mision.titulo}</span>
                        </label>
                        <button
                          className="btn-eliminar-mision"
                          onClick={() => handleEliminarMision(mision.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      {mision.descripcion && (
                        <p className="mision-descripcion">{mision.descripcion}</p>
                      )}
                      <div className="mision-fecha">
                        Creada: {fecha.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="profile-section">
            <h2>Interacciones</h2>
            {totalMenciones === 0 ? (
              <p className="no-interactions">
                Aún no has mencionado a {personaje.nombre} en tu diario.
              </p>
            ) : (
              <div className="interactions-list">
                {entradasConMencion.map(entrada => {
                  const fecha = new Date(entrada.date)
                  return (
                    <div key={entrada.id} className="interaction-item">
                      <div className="interaction-date">
                        {fecha.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="interaction-text">
                        {entrada.text.substring(0, 200)}
                        {entrada.text.length > 200 && '...'}
                      </div>
                      <Link to="/" className="interaction-link">
                        Ver entrada completa →
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {mostrarModalMision && (
        <AddMissionModal
          personaje={personaje}
          onClose={() => setMostrarModalMision(false)}
          onSave={handleAgregarMision}
        />
      )}
    </div>
  )
}

export default CharacterProfile

