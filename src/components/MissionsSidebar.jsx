import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerTodosLosPersonajes } from '../data/personajes'

function MissionsSidebar() {
  const [misiones, setMisiones] = useState([])
  const [openSections, setOpenSections] = useState({
    pendientes: false,
    enProgreso: false,
    completadas: false,
    permanentes: false
  })

  // Cargar misiones del localStorage
  useEffect(() => {
    const cargarMisiones = () => {
      const misionesGuardadas = localStorage.getItem('misiones')
      if (misionesGuardadas) {
        try {
          setMisiones(JSON.parse(misionesGuardadas))
        } catch (e) {
          console.error('Error al cargar misiones:', e)
        }
      }
    }
    
    cargarMisiones()
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      cargarMisiones()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // También verificar periódicamente (por si el cambio fue en la misma pestaña)
    const interval = setInterval(cargarMisiones, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Agrupar misiones por estado
  const pendientes = misiones.filter(m => m.estado === 'pendiente' && !m.permanente)
  const enProgreso = misiones.filter(m => m.estado === 'en-progreso' && !m.permanente)
  const completadas = misiones.filter(m => m.estado === 'completada' && !m.permanente)
  const permanentes = misiones.filter(m => m.permanente === true)

  // Función para obtener color según tipo de personaje
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

  const getInicial = (nombre) => nombre.charAt(0).toUpperCase()

  // Renderizar misión
  const renderizarMision = (mision) => {
    const todosPersonajes = obtenerTodosLosPersonajes()
    const personajesAsignados = mision.personajesIds?.map(id => 
      todosPersonajes.find(p => p.id === id)
    ).filter(Boolean) || []

    return (
      <Link
        key={mision.id}
        to={`/mision/${mision.id}`}
        className="mission-item"
      >
        <div className="mission-header-small">
          <h4 className="mission-title-small">{mision.titulo}</h4>
          {mision.prioridad && (
            <span className={`mission-priority mission-priority-${mision.prioridad}`}>
              {mision.prioridad}
            </span>
          )}
        </div>
        {mision.descripcion && (
          <p className="mission-description-small">{mision.descripcion}</p>
        )}
        {personajesAsignados.length > 0 && (
          <div className="mission-characters-small">
            {personajesAsignados.slice(0, 3).map(personaje => (
              <div
                key={personaje.id}
                className="mission-character-avatar"
                style={{ backgroundColor: getTipoColor(personaje.tipo) }}
                title={personaje.nombre}
              >
                {personaje.imagen ? (
                  <img src={personaje.imagen} alt={personaje.nombre} />
                ) : (
                  getInicial(personaje.nombre)
                )}
              </div>
            ))}
            {personajesAsignados.length > 3 && (
              <span className="mission-more-characters">+{personajesAsignados.length - 3}</span>
            )}
          </div>
        )}
      </Link>
    )
  }

  return (
    <aside className="missions-sidebar">
      <div className="missions-sidebar-header">
        <h2>Misiones</h2>
        <Link to="/mision/nueva" className="btn-nueva-mision">
          + Nueva
        </Link>
      </div>

      {/* Pendientes */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('pendientes')}
        >
          <span className="accordion-title">Pendientes</span>
          <span className="accordion-count">{pendientes.length}</span>
          <span className="accordion-icon">
            {openSections.pendientes ? '▼' : '▶'}
          </span>
        </button>
        {openSections.pendientes && (
          <div className="accordion-content">
            <div className="missions-list">
              {pendientes.length === 0 ? (
                <p className="no-missions">No hay misiones pendientes</p>
              ) : (
                pendientes.map(renderizarMision)
              )}
            </div>
          </div>
        )}
      </div>

      {/* En Progreso */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('enProgreso')}
        >
          <span className="accordion-title">En Progreso</span>
          <span className="accordion-count">{enProgreso.length}</span>
          <span className="accordion-icon">
            {openSections.enProgreso ? '▼' : '▶'}
          </span>
        </button>
        {openSections.enProgreso && (
          <div className="accordion-content">
            <div className="missions-list">
              {enProgreso.length === 0 ? (
                <p className="no-missions">No hay misiones en progreso</p>
              ) : (
                enProgreso.map(renderizarMision)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Completadas */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('completadas')}
        >
          <span className="accordion-title">Completadas</span>
          <span className="accordion-count">{completadas.length}</span>
          <span className="accordion-icon">
            {openSections.completadas ? '▼' : '▶'}
          </span>
        </button>
        {openSections.completadas && (
          <div className="accordion-content">
            <div className="missions-list">
              {completadas.length === 0 ? (
                <p className="no-missions">No hay misiones completadas</p>
              ) : (
                completadas.map(renderizarMision)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Permanentes */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('permanentes')}
        >
          <span className="accordion-title">Permanentes</span>
          <span className="accordion-count">{permanentes.length}</span>
          <span className="accordion-icon">
            {openSections.permanentes ? '▼' : '▶'}
          </span>
        </button>
        {openSections.permanentes && (
          <div className="accordion-content">
            <div className="missions-list">
              {permanentes.length === 0 ? (
                <p className="no-missions">No hay misiones permanentes</p>
              ) : (
                permanentes.map(renderizarMision)
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default MissionsSidebar

