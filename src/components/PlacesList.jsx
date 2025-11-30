import { Link } from 'react-router-dom'
import { obtenerTodosLosLugares } from '../data/lugares'
import { useState, useEffect } from 'react'

function PlacesList({ entradas = [] }) {
  const [lugares, setLugares] = useState([])

  useEffect(() => {
    const todos = obtenerTodosLosLugares()
    setLugares(todos)
  }, [])

  // Calcular menciones por lugar
  const mencionesPorLugar = {}
  
  entradas.forEach(entrada => {
    entrada.mentions?.lugares?.forEach(id => {
      mencionesPorLugar[id] = (mencionesPorLugar[id] || 0) + 1
    })
  })
  
  // Función para obtener inicial del nombre
  const getInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase()
  }
  
  if (lugares.length === 0) return null
  
  return (
    <aside className="places-sidebar">
      <div className="sidebar-header">
        <h2>Lugares</h2>
      </div>
      
      <div className="places-list">
        {lugares.map(lugar => {
          const menciones = mencionesPorLugar[lugar.id] || 0
          
          return (
            <Link
              key={lugar.id}
              to={`/lugar/${lugar.id}`}
              className="place-item"
            >
              {lugar.imagen ? (
                <div className="place-avatar-small">
                  <img src={lugar.imagen} alt={lugar.nombre} />
                </div>
              ) : (
                <div className="place-avatar-small" style={{ backgroundColor: '#34d399' }}>
                  {getInicial(lugar.nombre)}
                </div>
              )}
              <div className="place-info-small">
                <div className="place-name-small">{lugar.nombre}</div>
                {menciones > 0 && (
                  <div className="place-mentions-small">
                    {menciones} {menciones === 1 ? 'mención' : 'menciones'}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

export default PlacesList

