import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  obtenerTodasLasHabilidades,
  obtenerHabilidadesPorCategoria,
  getNombreCategoria,
  guardarHabilidadesPersonalizadas,
  cargarHabilidadesPersonalizadas,
  guardarModificacionesHabilidades,
  cargarModificacionesHabilidades
} from '../data/habilidades'

function AdminAbilities() {
  const navigate = useNavigate()
  const [habilidades, setHabilidades] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [habilidadEditando, setHabilidadEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'espirituales',
    imagen: '',
    id: ''
  })
  const [entradas, setEntradas] = useState([])

  useEffect(() => {
    cargarHabilidades()
    cargarEntradas()
  }, [])

  const cargarEntradas = () => {
    const entradasGuardadas = localStorage.getItem('diarioEntradas')
    if (entradasGuardadas) {
      try {
        setEntradas(JSON.parse(entradasGuardadas))
      } catch (e) {
        console.error('Error al cargar entradas:', e)
      }
    }
  }

  const cargarHabilidades = () => {
    const todas = obtenerTodasLasHabilidades()
    setHabilidades(todas)
  }

  const handleNuevaHabilidad = () => {
    setHabilidadEditando(null)
    setFormData({
      nombre: '',
      categoria: 'espirituales',
      imagen: '',
      id: ''
    })
    setMostrarFormulario(true)
  }

  const handleEditarHabilidad = (habilidad) => {
    setHabilidadEditando(habilidad)
    setFormData({
      nombre: habilidad.nombre,
      categoria: habilidad.categoria || 'espirituales',
      imagen: habilidad.imagen || '',
      id: habilidad.id
    })
    setMostrarFormulario(true)
  }

  const handleEliminarHabilidad = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta habilidad?')) {
      const personalizadas = cargarHabilidadesPersonalizadas()
      const nuevasPersonalizadas = personalizadas.filter(h => h.id !== id)
      guardarHabilidadesPersonalizadas(nuevasPersonalizadas)
      cargarHabilidades()
    }
  }

  const handleGuardar = () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido')
      return
    }

    if (habilidadEditando) {
      // Es una habilidad personalizada, actualizarla
      if (habilidadEditando.id.startsWith('personalizado-')) {
        const personalizadas = cargarHabilidadesPersonalizadas()
        const actualizadas = personalizadas.map(h => 
          h.id === habilidadEditando.id 
            ? { ...h, ...formData }
            : h
        )
        guardarHabilidadesPersonalizadas(actualizadas)
      } else {
        // Es una habilidad base, guardar solo modificaciones
        const modificaciones = cargarModificacionesHabilidades()
        modificaciones[habilidadEditando.id] = {
          imagen: formData.imagen || null
        }
        guardarModificacionesHabilidades(modificaciones)
      }
    } else {
      // Nueva habilidad personalizada
      const nuevoId = `personalizado-${Date.now()}`
      const nuevaHabilidad = {
        id: nuevoId,
        nombre: formData.nombre,
        categoria: formData.categoria,
        imagen: formData.imagen || null
      }
      const personalizadas = cargarHabilidadesPersonalizadas()
      guardarHabilidadesPersonalizadas([...personalizadas, nuevaHabilidad])
    }

    setMostrarFormulario(false)
    cargarHabilidades()
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

  const esHabilidadBase = (id) => {
    return !id.startsWith('personalizado-')
  }

  const getInicial = (nombre) => nombre.charAt(0).toUpperCase()
  
  const getCategoriaColor = (categoria) => {
    const colores = {
      "espirituales": "#a78bfa",
      "empoderamiento": "#f472b6",
      "de-materia": "#60a5fa",
    }
    return colores[categoria] || "#94a3b8"
  }

  // Calcular menciones por habilidad
  const mencionesPorHabilidad = {}
  entradas.forEach(entrada => {
    entrada.mentions?.habilidades?.forEach(id => {
      mencionesPorHabilidad[id] = (mencionesPorHabilidad[id] || 0) + 1
    })
  })

  const habilidadesPorCategoria = obtenerHabilidadesPorCategoria()

  const renderizarHabilidadCard = (habilidad) => {
    const esBase = esHabilidadBase(habilidad.id)
    const menciones = mencionesPorHabilidad[habilidad.id] || 0
    
    return (
      <div key={habilidad.id} className="admin-character-card">
        <div className="admin-character-avatar">
          {habilidad.imagen ? (
            <img src={habilidad.imagen} alt={habilidad.nombre} />
          ) : (
            <div style={{ backgroundColor: getCategoriaColor(habilidad.categoria || 'espirituales') }}>
              {getInicial(habilidad.nombre)}
            </div>
          )}
        </div>
        <div className="admin-character-info">
          <h3>{habilidad.nombre}</h3>
          <div className="admin-character-meta">
            <span className="badge-tipo">{getNombreCategoria(habilidad.categoria || 'espirituales')}</span>
            {esBase && <span className="badge-base">Base</span>}
          </div>
          <div className="admin-character-stats">
            <span>{menciones} {menciones === 1 ? 'mención' : 'menciones'}</span>
          </div>
        </div>
        <div className="admin-character-actions">
          <Link to={`/habilidad/${habilidad.id}`} className="btn-ver">
            Ver Perfil
          </Link>
          <button 
            className="btn-editar" 
            onClick={() => handleEditarHabilidad(habilidad)}
          >
            Editar
          </button>
          {!esBase && (
            <button 
              className="btn-eliminar-admin" 
              onClick={() => handleEliminarHabilidad(habilidad.id)}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1>Administrar Habilidades</h1>
        <button className="btn-nuevo" onClick={handleNuevaHabilidad}>
          + Nueva Habilidad
        </button>
      </div>

      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{habilidadEditando ? 'Editar Habilidad' : 'Nueva Habilidad'}</h2>
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
                  placeholder="Nombre de la habilidad"
                  disabled={habilidadEditando && esHabilidadBase(habilidadEditando.id)}
                />
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  disabled={habilidadEditando && esHabilidadBase(habilidadEditando.id)}
                >
                  <option value="espirituales">Espirituales</option>
                  <option value="empoderamiento">Empoderamiento</option>
                  <option value="de-materia">De Materia</option>
                </select>
              </div>
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
        Administra tus habilidades y revisa cuántas menciones tiene cada una en tu diario.
      </p>

      <div className="admin-sections">
        {/* Espirituales */}
        {(() => {
          const espirituales = habilidadesPorCategoria.espirituales || []
          if (espirituales.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Espirituales</h2>
              <div className="admin-list">
                {espirituales.map(habilidad => renderizarHabilidadCard(habilidad))}
              </div>
            </div>
          )
        })()}

        {/* Empoderamiento */}
        {(() => {
          const empoderamiento = habilidadesPorCategoria.empoderamiento || []
          if (empoderamiento.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">Empoderamiento</h2>
              <div className="admin-list">
                {empoderamiento.map(habilidad => renderizarHabilidadCard(habilidad))}
              </div>
            </div>
          )
        })()}

        {/* De Materia */}
        {(() => {
          const deMateria = habilidadesPorCategoria['de-materia'] || []
          if (deMateria.length === 0) return null
          
          return (
            <div className="admin-section">
              <h2 className="admin-section-title">De Materia</h2>
              <div className="admin-list">
                {deMateria.map(habilidad => renderizarHabilidadCard(habilidad))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default AdminAbilities
