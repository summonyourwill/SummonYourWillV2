import { Link } from 'react-router-dom'
import { obtenerTodosLosPersonajes, ordenarPersonajes } from '../data/personajes'
import { useState, useEffect } from 'react'

function CharacterList({ entradas = [] }) {
  const [personajes, setPersonajes] = useState([])

  useEffect(() => {
    const todos = obtenerTodosLosPersonajes()
    setPersonajes(ordenarPersonajes(todos))
  }, [])
  
  // Calcular menciones por personaje
  const mencionesPorPersonaje = {}
  
  entradas.forEach(entrada => {
    entrada.mentions?.personajes?.forEach(id => {
      mencionesPorPersonaje[id] = (mencionesPorPersonaje[id] || 0) + 1
    })
  })
  
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
  
  // Agrupar personajes por tipo y grupo
  const agruparPersonajes = () => {
    const grupos = {
      dios: [],
      yo: [],
      maestros: [],
      guias: [],
      heroes: {}
    }
    
    personajes.forEach(personaje => {
      if (personaje.tipo === 'dios') {
        grupos.dios.push(personaje)
      } else if (personaje.tipo === 'yo') {
        grupos.yo.push(personaje)
      } else if (personaje.tipo === 'maestro') {
        grupos.maestros.push(personaje)
      } else if (personaje.tipo === 'guia') {
        grupos.guias.push(personaje)
      } else if (personaje.tipo === 'heroe') {
        const grupo = personaje.grupo || 'Sin Grupo'
        if (!grupos.heroes[grupo]) {
          grupos.heroes[grupo] = []
        }
        grupos.heroes[grupo].push(personaje)
      }
    })
    
    return grupos
  }
  
  const grupos = agruparPersonajes()
  
  // Función para renderizar un personaje
  const renderizarPersonaje = (personaje) => {
    const menciones = mencionesPorPersonaje[personaje.id] || 0
    
    return (
      <Link
        key={personaje.id}
        to={`/personaje/${personaje.id}`}
        className="character-item"
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
        <div className="character-info-small">
          <div className="character-name-small">{personaje.nombre}</div>
          <div className="character-meta-small">
            <span className="character-type-small">{personaje.tipo}</span>
            {personaje.grupo && (
              <span className="character-group-small">• {personaje.grupo}</span>
            )}
          </div>
          {menciones > 0 && (
            <div className="character-mentions-small">
              {menciones} {menciones === 1 ? 'mención' : 'menciones'}
            </div>
          )}
        </div>
      </Link>
    )
  }
  
  return (
    <aside className="character-sidebar">
      <div className="sidebar-header">
        <h2>Personajes</h2>
      </div>
      
      <div className="character-list">
        {/* Dios - Sin subtítulo */}
        {grupos.dios.map(renderizarPersonaje)}
        
        {/* Yo - Sin subtítulo */}
        {grupos.yo.map(renderizarPersonaje)}
        
        {/* Maestros - Con subtítulo */}
        {grupos.maestros.length > 0 && (
          <div className="character-category">
            <h3 className="character-category-title">Maestros</h3>
            {grupos.maestros.map(renderizarPersonaje)}
          </div>
        )}
        
        {/* Guías - Con subtítulo */}
        {grupos.guias.length > 0 && (
          <div className="character-category">
            <h3 className="character-category-title">Guías</h3>
            {grupos.guias.map(renderizarPersonaje)}
          </div>
        )}
        
        {/* Héroes - Con subtítulo y subcategorías por grupo */}
        {Object.keys(grupos.heroes).length > 0 && (
          <div className="character-category">
            <h3 className="character-category-title">Héroes</h3>
            {Object.keys(grupos.heroes).sort().map(grupo => (
              <div key={grupo} className="character-subcategory">
                <h4 className="character-subcategory-title">{grupo}</h4>
                {grupos.heroes[grupo].map(renderizarPersonaje)}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default CharacterList

