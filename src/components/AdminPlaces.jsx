import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  obtenerTodosLosLugares,
  guardarLugaresPersonalizados,
  cargarLugaresPersonalizados,
  guardarModificacionesLugares,
  cargarModificacionesLugares
} from '../data/lugares'

function AdminPlaces() {
  const navigate = useNavigate()
  const [lugares, setLugares] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [lugarEditando, setLugarEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    id: ''
  })
  const [entradas, setEntradas] = useState([])

  useEffect(() => {
    cargarLugares()
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

  const cargarLugares = () => {
    const todos = obtenerTodosLosLugares()
    setLugares(todos)
  }

  const handleNuevoLugar = () => {
    setLugarEditando(null)
    setFormData({
      nombre: '',
      imagen: '',
      id: ''
    })
    setMostrarFormulario(true)
  }

  const handleEditarLugar = (lugar) => {
    setLugarEditando(lugar)
    setFormData({
      nombre: lugar.nombre,
      imagen: lugar.imagen || '',
      id: lugar.id
    })
    setMostrarFormulario(true)
  }

  const handleEliminarLugar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este lugar?')) {
      const personalizados = cargarLugaresPersonalizados()
      const nuevosPersonalizados = personalizados.filter(l => l.id !== id)
      guardarLugaresPersonalizados(nuevosPersonalizados)
      cargarLugares()
    }
  }

  const handleGuardar = () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido')
      return
    }

    if (lugarEditando) {
      // Es un lugar personalizado, actualizarlo
      if (lugarEditando.id.startsWith('personalizado-')) {
        const personalizados = cargarLugaresPersonalizados()
        const actualizados = personalizados.map(l => 
          l.id === lugarEditando.id 
            ? { ...l, ...formData }
            : l
        )
        guardarLugaresPersonalizados(actualizados)
      } else {
        // Es un lugar base, guardar solo modificaciones
        const modificaciones = cargarModificacionesLugares()
        modificaciones[lugarEditando.id] = {
          imagen: formData.imagen || null
        }
        guardarModificacionesLugares(modificaciones)
      }
    } else {
      // Nuevo lugar personalizado
      const nuevoId = `personalizado-${Date.now()}`
      const nuevoLugar = {
        id: nuevoId,
        nombre: formData.nombre,
        imagen: formData.imagen || null
      }
      const personalizados = cargarLugaresPersonalizados()
      guardarLugaresPersonalizados([...personalizados, nuevoLugar])
    }

    setMostrarFormulario(false)
    cargarLugares()
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

  const esLugarBase = (id) => {
    return !id.startsWith('personalizado-')
  }

  const getInicial = (nombre) => nombre.charAt(0).toUpperCase()

  // Calcular menciones por lugar
  const mencionesPorLugar = {}
  entradas.forEach(entrada => {
    entrada.mentions?.lugares?.forEach(id => {
      mencionesPorLugar[id] = (mencionesPorLugar[id] || 0) + 1
    })
  })

  const renderizarLugarCard = (lugar) => {
    const esBase = esLugarBase(lugar.id)
    const menciones = mencionesPorLugar[lugar.id] || 0
    
    return (
      <div key={lugar.id} className="admin-character-card">
        <div className="admin-character-avatar">
          {lugar.imagen ? (
            <img src={lugar.imagen} alt={lugar.nombre} />
          ) : (
            <div style={{ backgroundColor: '#34d399' }}>
              {getInicial(lugar.nombre)}
            </div>
          )}
        </div>
        <div className="admin-character-info">
          <h3>{lugar.nombre}</h3>
          <div className="admin-character-meta">
            {esBase && <span className="badge-base">Base</span>}
          </div>
          <div className="admin-character-stats">
            <span>{menciones} {menciones === 1 ? 'mención' : 'menciones'}</span>
          </div>
        </div>
        <div className="admin-character-actions">
          <Link to={`/lugar/${lugar.id}`} className="btn-ver">
            Ver Perfil
          </Link>
          <button 
            className="btn-editar" 
            onClick={() => handleEditarLugar(lugar)}
          >
            Editar
          </button>
          {!esBase && (
            <button 
              className="btn-eliminar-admin" 
              onClick={() => handleEliminarLugar(lugar.id)}
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
        <h1>Administrar Lugares</h1>
        <button className="btn-nuevo" onClick={handleNuevoLugar}>
          + Nuevo Lugar
        </button>
      </div>

      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{lugarEditando ? 'Editar Lugar' : 'Nuevo Lugar'}</h2>
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
                  placeholder="Nombre del lugar"
                  disabled={lugarEditando && esLugarBase(lugarEditando.id)}
                />
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
        Administra tus lugares y revisa cuántas menciones tiene cada uno en tu diario.
      </p>

      <div className="admin-list">
        {lugares.map(lugar => renderizarLugarCard(lugar))}
      </div>
    </div>
  )
}

export default AdminPlaces
