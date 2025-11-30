import { useParams, Link, useNavigate } from 'react-router-dom'
import { obtenerTodosLosLugares } from '../data/lugares'
import { useState, useEffect } from 'react'

function PlaceProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entradas, setEntradas] = useState([])
  const [lugar, setLugar] = useState(null)
  
  useEffect(() => {
    const todos = obtenerTodosLosLugares()
    const encontrado = todos.find(l => l.id === id)
    setLugar(encontrado || null)
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

  
  if (!lugar) {
    return (
      <div className="profile-container">
        <div className="profile-not-found">
          <h2>Lugar no encontrado</h2>
          <Link to="/" className="btn-volver">Volver al Diario</Link>
        </div>
      </div>
    )
  }
  
  // Filtrar entradas que mencionan a este lugar
  const entradasConMencion = entradas.filter(entrada =>
    entrada.mentions?.lugares?.includes(id)
  )
  
  const totalMenciones = entradasConMencion.length
  
  // Función para obtener inicial del nombre
  const getInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase()
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
          {lugar.imagen ? (
            <div className="profile-avatar-large">
              <img src={lugar.imagen} alt={lugar.nombre} />
            </div>
          ) : (
            <div className="profile-avatar-large" style={{ backgroundColor: '#34d399' }}>
              {getInicial(lugar.nombre)}
            </div>
          )}
          
          <div className="profile-info">
            <h1 className="profile-name">{lugar.nombre}</h1>
            <div className="profile-badges">
              <span className="badge-tipo">Lugar</span>
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
            <h2>Sobre este lugar</h2>
            <p className="profile-description">
              Un lugar especial en tu viaje espiritual y conexión con el universo.
            </p>
          </section>
          
          <section className="profile-section">
            <h2>Interacciones</h2>
            {totalMenciones === 0 ? (
              <p className="no-interactions">
                Aún no has mencionado a {lugar.nombre} en tu diario.
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

export default PlaceProfile

