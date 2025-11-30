import { Link } from 'react-router-dom'
import { obtenerTodasLasHabilidades, obtenerHabilidadesPorCategoria, getNombreCategoria } from '../data/habilidades'
import { useState, useEffect } from 'react'

function AbilitiesList({ entradas = [] }) {
  const [habilidades, setHabilidades] = useState([])
  const [categorias, setCategorias] = useState({})

  useEffect(() => {
    const todas = obtenerTodasLasHabilidades()
    const porCategoria = obtenerHabilidadesPorCategoria()
    setHabilidades(todas)
    setCategorias(porCategoria)
  }, [])

  // Calcular menciones por habilidad
  const mencionesPorHabilidad = {}
  
  entradas.forEach(entrada => {
    entrada.mentions?.habilidades?.forEach(id => {
      mencionesPorHabilidad[id] = (mencionesPorHabilidad[id] || 0) + 1
    })
  })
  
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
  
  if (habilidades.length === 0) return null
  
  return (
    <aside className="abilities-sidebar">
      <div className="sidebar-header">
        <h2>Habilidades</h2>
      </div>
      
      <div className="abilities-list">
        {Object.keys(categorias).map(categoria => {
          const habilidadesCategoria = categorias[categoria]
          if (habilidadesCategoria.length === 0) return null
          
          return (
            <div key={categoria} className="ability-category">
              <h3 className="ability-category-title">
                {getNombreCategoria(categoria)}
              </h3>
              {habilidadesCategoria.map(habilidad => {
                const menciones = mencionesPorHabilidad[habilidad.id] || 0
                
                return (
                  <Link
                    key={habilidad.id}
                    to={`/habilidad/${habilidad.id}`}
                    className="ability-item"
                  >
                    {habilidad.imagen ? (
                      <div className="ability-avatar-small">
                        <img src={habilidad.imagen} alt={habilidad.nombre} />
                      </div>
                    ) : (
                      <div className="ability-avatar-small" style={{ backgroundColor: getCategoriaColor(categoria) }}>
                        {getInicial(habilidad.nombre)}
                      </div>
                    )}
                    <div className="ability-info-small">
                      <div className="ability-name-small">{habilidad.nombre}</div>
                      {menciones > 0 && (
                        <div className="ability-mentions-small">
                          {menciones} {menciones === 1 ? 'mención' : 'menciones'}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default AbilitiesList

