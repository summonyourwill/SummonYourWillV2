import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  obtenerTodasLasHabilidades,
  getNombreCategoria
} from '../data/habilidades'
import { useState, useEffect } from 'react'

function AbilityProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entradas, setEntradas] = useState([])
  const [habilidad, setHabilidad] = useState(null)
  
  useEffect(() => {
    const todas = obtenerTodasLasHabilidades()
    const encontrada = todas.find(h => h.id === id)
    setHabilidad(encontrada || null)
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

  
  if (!habilidad) {
    return (
      <div className="profile-container">
        <div className="profile-not-found">
          <h2>Habilidad no encontrada</h2>
          <Link to="/" className="btn-volver">Volver al Diario</Link>
        </div>
      </div>
    )
  }
  
  // Filtrar entradas que mencionan a esta habilidad
  const entradasConMencion = entradas.filter(entrada =>
    entrada.mentions?.habilidades?.includes(id)
  )
  
  const totalMenciones = entradasConMencion.length
  
  // Función para obtener inicial del nombre
  const getInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase()
  }
  
  // Función para obtener color según categoría
  const getCategoriaColor = (categoria) => {
    const colores = {
      "espirituales": "#a78bfa",
      "empoderamiento": "#f472b6",
      "de-materia": "#60a5fa",
    }
    return colores[categoria] || "#94a3b8"
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
          {habilidad.imagen ? (
            <div className="profile-avatar-large">
              <img src={habilidad.imagen} alt={habilidad.nombre} />
            </div>
          ) : (
            <div className="profile-avatar-large" style={{ backgroundColor: getCategoriaColor(habilidad.categoria) }}>
              {getInicial(habilidad.nombre)}
            </div>
          )}
          
          <div className="profile-info">
            <h1 className="profile-name">{habilidad.nombre}</h1>
            <div className="profile-badges">
              <span className="badge-tipo">Habilidad</span>
              {habilidad.categoria && (
                <span className="badge-grupo">{getNombreCategoria(habilidad.categoria)}</span>
              )}
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{totalMenciones}</span>
                <span className="stat-label">
                  {totalMenciones === 1 ? 'Mención' : 'Menciones'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-sections">
          <section className="profile-section">
            <h2>Sobre esta habilidad</h2>
            <p className="profile-description">
              Una habilidad que forma parte de tu desarrollo espiritual y personal.
            </p>
            {habilidad.categoria && (
              <p className="profile-group-info">
                <strong>Categoría:</strong> {getNombreCategoria(habilidad.categoria)}
              </p>
            )}
          </section>
          
          <section className="profile-section">
            <h2>Interacciones</h2>
            {totalMenciones === 0 ? (
              <p className="no-interactions">
                Aún no has mencionado a {habilidad.nombre} en tu diario.
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

    </div>
  )
}

export default AbilityProfile

