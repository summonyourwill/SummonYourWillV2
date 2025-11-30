import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  obtenerTodosLosPersonajes, 
  guardarPersonajesPersonalizados,
  cargarPersonajesPersonalizados,
  guardarModificacionesPersonajes,
  cargarModificacionesPersonajes,
  ordenarPersonajes
} from '../data/personajes'

function AdminCharacters() {
  const navigate = useNavigate()
  const [personajes, setPersonajes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [personajeEditando, setPersonajeEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'maestro',
    grupo: '',
    imagen: '',
    id: ''
  })
  const [gruposSugerencias, setGruposSugerencias] = useState([])
  const [mostrarSugerenciasGrupo, setMostrarSugerenciasGrupo] = useState(false)
  const [indiceGrupoSeleccionado, setIndiceGrupoSeleccionado] = useState(0)

  useEffect(() => {
    cargarPersonajes()
  }, [])

  const cargarPersonajes = () => {
    const todos = obtenerTodosLosPersonajes()
    setPersonajes(ordenarPersonajes(todos))
  }

  const handleNuevoPersonaje = () => {
    setPersonajeEditando(null)
    setFormData({
      nombre: '',
      tipo: 'maestro',
      grupo: '',
      imagen: '',
      id: ''
    })
    setMostrarFormulario(true)
  }

  const handleEditarPersonaje = (personaje) => {
    setPersonajeEditando(personaje)
    setFormData({
      nombre: personaje.nombre,
      tipo: personaje.tipo,
      grupo: personaje.grupo || '',
      imagen: personaje.imagen || '',
      id: personaje.id
    })
    setMostrarFormulario(true)
  }

  const handleEliminarPersonaje = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este personaje?')) {
      const personalizados = cargarPersonajesPersonalizados()
      const nuevosPersonalizados = personalizados.filter(p => p.id !== id)
      guardarPersonajesPersonalizados(nuevosPersonalizados)
      cargarPersonajes()
    }
  }

  const handleGuardar = () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido')
      return
    }

    if (personajeEditando) {
      // Es un personaje personalizado, actualizarlo
      if (personajeEditando.id.startsWith('personalizado-')) {
        const personalizados = cargarPersonajesPersonalizados()
        const actualizados = personalizados.map(p => 
          p.id === personajeEditando.id 
            ? { ...p, ...formData, misiones: personajeEditando.misiones || [] }
            : p
        )
        guardarPersonajesPersonalizados(actualizados)
      } else {
        // Es un personaje base, guardar solo modificaciones
        const modificaciones = cargarModificacionesPersonajes()
        modificaciones[personajeEditando.id] = {
          imagen: formData.imagen || null,
          misiones: personajeEditando.misiones || []
        }
        guardarModificacionesPersonajes(modificaciones)
      }
    } else {
      // Nuevo personaje personalizado
      const nuevoId = `personalizado-${Date.now()}`
      const nuevoPersonaje = {
        id: nuevoId,
        nombre: formData.nombre,
        tipo: formData.tipo,
        grupo: formData.grupo || undefined,
        imagen: formData.imagen || null,
        misiones: []
      }
      const personalizados = cargarPersonajesPersonalizados()
      guardarPersonajesPersonalizados([...personalizados, nuevoPersonaje])
    }

    setMostrarFormulario(false)
    cargarPersonajes()
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, imagen: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const esPersonajeBase = (id) => {
    return !id.startsWith('personalizado-')
  }

  // Obtener todos los grupos existentes de héroes
  const obtenerGruposExistentes = () => {
    const todos = obtenerTodosLosPersonajes()
    const grupos = new Set()
    
    todos.forEach(personaje => {
      if (personaje.tipo === 'heroe' && personaje.grupo) {
        grupos.add(personaje.grupo)
      }
    })
    
    return Array.from(grupos).sort()
  }

  // Buscar grupos que coincidan con el texto
  const buscarGrupos = (texto) => {
    if (!texto || texto.trim() === '') {
      return []
    }
    
    const gruposExistentes = obtenerGruposExistentes()
    const textoLower = texto.toLowerCase()
    
    return gruposExistentes.filter(grupo => 
      grupo.toLowerCase().includes(textoLower)
    ).slice(0, 5) // Limitar a 5 sugerencias
  }

  const handleGrupoChange = (e) => {
    const nuevoGrupo = e.target.value
    setFormData({ ...formData, grupo: nuevoGrupo })
    
    if (formData.tipo === 'heroe' && nuevoGrupo.trim() !== '') {
      const sugerencias = buscarGrupos(nuevoGrupo)
      setGruposSugerencias(sugerencias)
      setMostrarSugerenciasGrupo(sugerencias.length > 0)
      setIndiceGrupoSeleccionado(0)
    } else {
      setMostrarSugerenciasGrupo(false)
      setGruposSugerencias([])
    }
  }

  const handleSeleccionarGrupo = (grupo) => {
    setFormData({ ...formData, grupo: grupo })
    setMostrarSugerenciasGrupo(false)
    setGruposSugerencias([])
  }

  const handleGrupoKeyDown = (e) => {
    if (!mostrarSugerenciasGrupo || gruposSugerencias.length === 0) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndiceGrupoSeleccionado((prev) => (prev + 1) % gruposSugerencias.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceGrupoSeleccionado((prev) => (prev - 1 + gruposSugerencias.length) % gruposSugerencias.length)
    } else if (e.key === 'Enter' && gruposSugerencias.length > 0) {
      e.preventDefault()
      handleSeleccionarGrupo(gruposSugerencias[indiceGrupoSeleccionado])
    } else if (e.key === 'Escape') {
      setMostrarSugerenciasGrupo(false)
      setGruposSugerencias([])
    }
  }

  const getInicial = (nombre) => nombre.charAt(0).toUpperCase()
  
  const getTipoColor = (tipo) => {
    const colores = {
      "dios": "#fbbf24",
      "yo": "#60a5fa",
      "maestro": "#a78bfa",
      "guia": "#34d399",
      "heroe": "#f472b6",
      "mascota": "#f59e0b",
    }
    return colores[tipo] || "#94a3b8"
  }

  const renderizarPersonajeCard = (personaje) => {
    const esBase = esPersonajeBase(personaje.id)
    
    return (
      <div key={personaje.id} className="admin-character-card">
        <div className="admin-character-avatar">
          {personaje.imagen ? (
            <img src={personaje.imagen} alt={personaje.nombre} />
          ) : (
            <div style={{ backgroundColor: getTipoColor(personaje.tipo) }}>
              {getInicial(personaje.nombre)}
            </div>
          )}
        </div>
        <div className="admin-character-info">
          <h3>{personaje.nombre}</h3>
          <div className="admin-character-meta">
            <span className="badge-tipo">{personaje.tipo}</span>
            {personaje.grupo && (
              <span className="badge-grupo">{personaje.grupo}</span>
            )}
            {esBase && <span className="badge-base">Base</span>}
          </div>
          <div className="admin-character-stats">
            <span>{personaje.misiones?.length || 0} misiones</span>
          </div>
        </div>
        <div className="admin-character-actions">
          <Link to={`/personaje/${personaje.id}`} className="btn-ver">
            Ver Perfil
          </Link>
          <button 
            className="btn-editar" 
            onClick={() => handleEditarPersonaje(personaje)}
          >
            Editar
          </button>
          {!esBase && (
            <button 
              className="btn-eliminar-admin" 
              onClick={() => handleEliminarPersonaje(personaje.id)}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    )
  }

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mostrarSugerenciasGrupo && !e.target.closest('.grupo-autocomplete-container')) {
        setMostrarSugerenciasGrupo(false)
      }
    }
    
    if (mostrarSugerenciasGrupo) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mostrarSugerenciasGrupo])

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1>Administrar Personajes</h1>
        <button className="btn-nuevo" onClick={handleNuevoPersonaje}>
          + Nuevo Personaje
        </button>
      </div>

      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{personajeEditando ? 'Editar Personaje' : 'Nuevo Personaje'}</h2>
              <button className="btn-cerrar" onClick={() => setMostrarFormulario(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre del personaje"
                  disabled={personajeEditando && esPersonajeBase(personajeEditando.id)}
                />
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  disabled={personajeEditando && esPersonajeBase(personajeEditando.id)}
                >
                  <option value="maestro">Maestro</option>
                  <option value="guia">Guía</option>
                  <option value="heroe">Héroe</option>
                  <option value="mascota">Mascota</option>
                </select>
              </div>
              {formData.tipo === 'heroe' && (
                <div className="form-group grupo-autocomplete-container">
                  <label>Origen (Grupo)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.grupo}
                      onChange={handleGrupoChange}
                      onKeyDown={handleGrupoKeyDown}
                      onFocus={() => {
                        if (formData.grupo.trim() !== '') {
                          const sugerencias = buscarGrupos(formData.grupo)
                          setGruposSugerencias(sugerencias)
                          setMostrarSugerenciasGrupo(sugerencias.length > 0)
                        }
                      }}
                      placeholder="Ej: Avatar, Dragon Ball, etc."
                      disabled={personajeEditando && esPersonajeBase(personajeEditando.id)}
                    />
                    {mostrarSugerenciasGrupo && gruposSugerencias.length > 0 && (
                      <div className="grupo-autocomplete-dropdown">
                        {gruposSugerencias.map((grupo, index) => (
                          <div
                            key={grupo}
                            className={`grupo-autocomplete-item ${index === indiceGrupoSeleccionado ? 'selected' : ''}`}
                            onClick={() => handleSeleccionarGrupo(grupo)}
                            onMouseEnter={() => setIndiceGrupoSeleccionado(index)}
                          >
                            <span className="grupo-suggestion-icon">📁</span>
                            <span className="grupo-suggestion-name">{grupo}</span>
                            <span className="grupo-suggestion-hint">Grupo existente</span>
                          </div>
                        ))}
                        {formData.grupo.trim() !== '' && !gruposSugerencias.some(g => g.toLowerCase() === formData.grupo.toLowerCase()) && (
                          <div className="grupo-autocomplete-item grupo-nuevo">
                            <span className="grupo-suggestion-icon">➕</span>
                            <span className="grupo-suggestion-name">Crear "{formData.grupo}"</span>
                            <span className="grupo-suggestion-hint">Nuevo grupo</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {formData.grupo && (
                    <div className="grupo-hint">
                      {gruposSugerencias.some(g => g.toLowerCase() === formData.grupo.toLowerCase()) 
                        ? '✓ Este grupo ya existe. El héroe se agregará a este grupo.'
                        : 'Este será un nuevo grupo de héroes.'}
                    </div>
                  )}
                </div>
              )}
              <div className="form-group">
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                />
                {formData.imagen && (
                  <div className="imagen-preview">
                    <img src={formData.imagen} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button className="btn-cancelar" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
                <button className="btn-guardar" onClick={handleGuardar}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="admin-subtitle">
        Administra tus personajes y revisa cuántas misiones tiene cada uno.
      </p>

      <div className="admin-sections">
        {/* Dios y Yo */}
        {(() => {
          const diosYyo = personajes.filter(p => p.tipo === 'dios' || p.tipo === 'yo')
          if (diosYyo.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Dios y Yo</h2>
              <div className="admin-list">
                {diosYyo.map(personaje => renderizarPersonajeCard(personaje))}
              </div>
            </div>
          )
        })()}

        {/* Maestros */}
        {(() => {
          const maestros = personajes.filter(p => p.tipo === 'maestro')
          if (maestros.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Maestros</h2>
              <div className="admin-list">
                {maestros.map(personaje => renderizarPersonajeCard(personaje))}
              </div>
            </div>
          )
        })()}

        {/* Guías */}
        {(() => {
          const guias = personajes.filter(p => p.tipo === 'guia')
          if (guias.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Guías</h2>
              <div className="admin-list">
                {guias.map(personaje => renderizarPersonajeCard(personaje))}
              </div>
            </div>
          )
        })()}

        {/* Héroes */}
        {(() => {
          const heroes = personajes.filter(p => p.tipo === 'heroe')
          if (heroes.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Héroes</h2>
              <div className="admin-list">
                {heroes.map(personaje => renderizarPersonajeCard(personaje))}
              </div>
            </div>
          )
        })()}

        {/* Mascotas */}
        {(() => {
          const mascotas = personajes.filter(p => p.tipo === 'mascota')
          if (mascotas.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Mascotas</h2>
              <div className="admin-list">
                {mascotas.map(personaje => renderizarPersonajeCard(personaje))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default AdminCharacters


