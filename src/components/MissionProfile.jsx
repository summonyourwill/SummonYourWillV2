import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { obtenerTodosLosPersonajes } from '../data/personajes'

function MissionProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mision, setMision] = useState(null)
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'media',
    personajesIds: [],
    permanente: false
  })
  const [personajesDisponibles, setPersonajesDisponibles] = useState([])
  const [busquedaPersonaje, setBusquedaPersonaje] = useState('')

  useEffect(() => {
    const misiones = JSON.parse(localStorage.getItem('misiones') || '[]')
    const misionEncontrada = misiones.find(m => m.id === id)
    
    if (misionEncontrada) {
      setMision(misionEncontrada)
      setFormData({
        titulo: misionEncontrada.titulo || '',
        descripcion: misionEncontrada.descripcion || '',
        estado: misionEncontrada.estado || 'pendiente',
        prioridad: misionEncontrada.prioridad || 'media',
        personajesIds: misionEncontrada.personajesIds || [],
        permanente: misionEncontrada.permanente || false
      })
    } else if (id === 'nueva') {
      setEditando(true)
    } else {
      navigate('/')
    }

    const todosPersonajes = obtenerTodosLosPersonajes()
    setPersonajesDisponibles(todosPersonajes)
  }, [id, navigate])

  const guardarMision = () => {
    if (!formData.titulo.trim()) {
      alert('El título es requerido')
      return
    }

    const misiones = JSON.parse(localStorage.getItem('misiones') || '[]')
    let misionesActualizadas

    if (id === 'nueva') {
      const nuevaMision = {
        id: Date.now().toString(),
        ...formData,
        fechaCreacion: new Date().toISOString()
      }
      misionesActualizadas = [...misiones, nuevaMision]
      navigate(`/mision/${nuevaMision.id}`)
    } else {
      misionesActualizadas = misiones.map(m => 
        m.id === id ? { ...m, ...formData } : m
      )
    }

    localStorage.setItem('misiones', JSON.stringify(misionesActualizadas))
    setMision(misionesActualizadas.find(m => m.id === (id === 'nueva' ? misionesActualizadas[misionesActualizadas.length - 1].id : id)))
    setEditando(false)
  }

  const eliminarMision = () => {
    if (!window.confirm('¿Estás seguro de eliminar esta misión?')) return

    const misiones = JSON.parse(localStorage.getItem('misiones') || '[]')
    const misionesActualizadas = misiones.filter(m => m.id !== id)
    localStorage.setItem('misiones', JSON.stringify(misionesActualizadas))
    navigate('/')
  }

  const togglePersonaje = (personajeId) => {
    setFormData(prev => {
      const personajesIds = prev.personajesIds.includes(personajeId)
        ? prev.personajesIds.filter(id => id !== personajeId)
        : [...prev.personajesIds, personajeId]
      return { ...prev, personajesIds }
    })
  }

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

  const personajesFiltrados = personajesDisponibles.filter(p =>
    p.nombre.toLowerCase().includes(busquedaPersonaje.toLowerCase())
  )

  const personajesAsignados = (mision?.personajesIds || formData.personajesIds || []).map(id =>
    personajesDisponibles.find(p => p.id === id)
  ).filter(Boolean)

  if (!mision && id !== 'nueva') {
    return (
      <div className="profile-container">
        <div className="profile-not-found">
          <h2>Misión no encontrada</h2>
          <Link to="/" className="btn-home">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/" className="btn-volver">← Volver</Link>
        {mision && !editando && (
          <div>
            <button className="btn-editar" onClick={() => setEditando(true)}>
              Editar
            </button>
            <button className="btn-eliminar-admin" onClick={eliminarMision}>
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="profile-content">
        {editando ? (
          <div className="mission-form-container">
            <div className="mission-form">
              {/* Título */}
              <div className="form-field-group">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título de la misión"
                />
              </div>

              {/* Descripción */}
              <div className="form-field-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-textarea"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción detallada de la misión..."
                  rows={6}
                />
              </div>

              {/* Estado */}
              <div className="form-field-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en-progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>

              {/* Prioridad */}
              <div className="form-field-group">
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select"
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Permanente */}
              <div className="form-field-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.permanente}
                    onChange={(e) => setFormData({ ...formData, permanente: e.target.checked })}
                  />
                  <span>Misión Permanente</span>
                </label>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Las misiones permanentes aparecen en una sección separada y no se mueven a completadas.
                </p>
              </div>

              {/* Personajes Asignados */}
              <div className="form-field-group">
                <label className="form-label">Personajes Asignados</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar personaje..."
                  value={busquedaPersonaje}
                  onChange={(e) => setBusquedaPersonaje(e.target.value)}
                />
                <div className="characters-selection-scrollable">
                  {personajesFiltrados.map(personaje => {
                    const estaAsignado = formData.personajesIds.includes(personaje.id)
                    return (
                      <div
                        key={personaje.id}
                        className={`character-select-item ${estaAsignado ? 'selected' : ''}`}
                        onClick={() => togglePersonaje(personaje.id)}
                      >
                        {personaje.imagen ? (
                          <div className="character-avatar-small">
                            <img src={personaje.imagen} alt={personaje.nombre} />
                          </div>
                        ) : (
                          <div className="character-avatar-small" style={{ backgroundColor: getTipoColor(personaje.tipo) }}>
                            {getInicial(personaje.nombre)}
                          </div>
                        )}
                        <span>{personaje.nombre}</span>
                      </div>
                    )
                  })}
                </div>
                {personajesAsignados.length > 0 && (
                  <div className="assigned-characters">
                    <strong>Asignados:</strong>
                    <div className="assigned-characters-list">
                      {personajesAsignados.map(personaje => (
                        <div key={personaje.id} className="assigned-character-tag">
                          {personaje.nombre}
                          <button onClick={() => togglePersonaje(personaje.id)}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="form-actions-end">
                <button className="btn-cancelar" onClick={() => {
                  if (id === 'nueva') {
                    navigate('/')
                  } else {
                    setEditando(false)
                  }
                }}>
                  Cancelar
                </button>
                <button className="btn-guardar" onClick={guardarMision}>
                  {id === 'nueva' ? 'Crear Misión' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-card">
              <div className="profile-info">
                <h1 className="profile-name">{mision?.titulo}</h1>
                <div className="profile-badges">
                  <span className={`badge-estado badge-${mision?.estado}`}>
                    {mision?.estado === 'pendiente' ? 'Pendiente' : 
                     mision?.estado === 'en-progreso' ? 'En Progreso' : 'Completada'}
                  </span>
                  {mision?.prioridad && (
                    <span className={`badge-prioridad badge-prioridad-${mision?.prioridad}`}>
                      {mision?.prioridad}
                    </span>
                  )}
                  {mision?.permanente && (
                    <span className="badge-permanente">
                      Permanente
                    </span>
                  )}
                </div>
              </div>
            </div>

            {mision?.descripcion && (
              <div className="profile-section">
                <h2>Descripción</h2>
                <p className="profile-description">{mision.descripcion}</p>
              </div>
            )}

            {personajesAsignados.length > 0 && (
              <div className="profile-section">
                <h2>Personajes Asignados</h2>
                <div className="assigned-characters-grid">
                  {personajesAsignados.map(personaje => (
                    <Link
                      key={personaje.id}
                      to={`/personaje/${personaje.id}`}
                      className="assigned-character-card"
                    >
                      {personaje.imagen ? (
                        <div className="profile-avatar-large">
                          <img src={personaje.imagen} alt={personaje.nombre} />
                        </div>
                      ) : (
                        <div className="profile-avatar-large" style={{ backgroundColor: getTipoColor(personaje.tipo) }}>
                          {getInicial(personaje.nombre)}
                        </div>
                      )}
                      <h3>{personaje.nombre}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-section">
              <h2>Información</h2>
              <div className="mission-info">
                <div className="mission-info-item">
                  <strong>Fecha de Creación:</strong>
                  <span>{new Date(mision?.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MissionProfile

