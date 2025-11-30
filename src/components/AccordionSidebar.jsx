import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerTodosLosPersonajes, ordenarPersonajes } from '../data/personajes'
import { obtenerTodasLasHabilidades, obtenerHabilidadesPorCategoria, getNombreCategoria } from '../data/habilidades'
import { obtenerTodosLosLugares } from '../data/lugares'

function AccordionSidebar({ entradas = [] }) {
  const [openSections, setOpenSections] = useState({
    maestros: false,
    heroes: false,
    guias: false,
    habilidades: false,
    lugares: false
  })

  // Estado para los subgrupos de héroes
  const [openHeroGroups, setOpenHeroGroups] = useState({})

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleHeroGroup = (grupo) => {
    setOpenHeroGroups(prev => ({
      ...prev,
      [grupo]: !prev[grupo]
    }))
  }

  // Obtener todos los datos
  const todosPersonajes = ordenarPersonajes(obtenerTodosLosPersonajes())
  const todasHabilidades = obtenerTodasLasHabilidades()
  const habilidadesPorCategoria = obtenerHabilidadesPorCategoria()
  const todosLugares = obtenerTodosLosLugares()

  // Calcular menciones
  const mencionesPorPersonaje = {}
  const mencionesPorHabilidad = {}
  const mencionesPorLugar = {}
  
  entradas.forEach(entrada => {
    entrada.mentions?.personajes?.forEach(id => {
      mencionesPorPersonaje[id] = (mencionesPorPersonaje[id] || 0) + 1
    })
    entrada.mentions?.habilidades?.forEach(id => {
      mencionesPorHabilidad[id] = (mencionesPorHabilidad[id] || 0) + 1
    })
    entrada.mentions?.lugares?.forEach(id => {
      mencionesPorLugar[id] = (mencionesPorLugar[id] || 0) + 1
    })
  })

  // Agrupar personajes
  const dios = todosPersonajes.find(p => p.tipo === 'dios')
  const yo = todosPersonajes.find(p => p.tipo === 'yo')
  const maestros = todosPersonajes.filter(p => p.tipo === 'maestro')
  const heroes = todosPersonajes.filter(p => p.tipo === 'heroe')
  const guias = todosPersonajes.filter(p => p.tipo === 'guia')

  // Agrupar héroes por grupo
  const heroesPorGrupo = {}
  heroes.forEach(heroe => {
    const grupo = heroe.grupo || 'Sin Grupo'
    if (!heroesPorGrupo[grupo]) {
      heroesPorGrupo[grupo] = []
    }
    heroesPorGrupo[grupo].push(heroe)
  })

  const gruposHeroes = Object.keys(heroesPorGrupo).sort()

  // Inicializar estado de grupos de héroes
  useEffect(() => {
    const initialGroups = {}
    Object.keys(heroesPorGrupo).forEach(grupo => {
      initialGroups[grupo] = false
    })
    setOpenHeroGroups(initialGroups)
  }, []) // Solo se ejecuta una vez al montar

  // Funciones auxiliares
  const getInicial = (nombre) => nombre.charAt(0).toUpperCase()
  
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

  const getCategoriaColor = (categoria) => {
    const colores = {
      "espirituales": "#a78bfa",
      "empoderamiento": "#f472b6",
      "de-materia": "#60a5fa",
    }
    return colores[categoria] || "#94a3b8"
  }

  // Renderizar personaje
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

  // Renderizar habilidad
  const renderizarHabilidad = (habilidad, categoria) => {
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
  }

  // Renderizar lugar
  const renderizarLugar = (lugar) => {
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
  }

  return (
    <aside className="accordion-sidebar">
      {/* Dios y Yo - Elementos fijos */}
      <div className="fixed-characters-section">
        <div className="character-list">
          {dios && renderizarPersonaje(dios)}
          {yo && renderizarPersonaje(yo)}
        </div>
      </div>

      {/* Maestros */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('maestros')}
        >
          <span className="accordion-title">Maestros</span>
          <span className="accordion-count">{maestros.length}</span>
          <span className="accordion-icon">
            {openSections.maestros ? '▼' : '▶'}
          </span>
        </button>
        {openSections.maestros && (
          <div className="accordion-content">
            <div className="character-list">
              {maestros.map(renderizarPersonaje)}
            </div>
          </div>
        )}
      </div>

      {/* Guías */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('guias')}
        >
          <span className="accordion-title">Guías</span>
          <span className="accordion-count">{guias.length}</span>
          <span className="accordion-icon">
            {openSections.guias ? '▼' : '▶'}
          </span>
        </button>
        {openSections.guias && (
          <div className="accordion-content">
            <div className="character-list">
              {guias.map(renderizarPersonaje)}
            </div>
          </div>
        )}
      </div>

      {/* Héroes */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('heroes')}
        >
          <span className="accordion-title">Héroes</span>
          <span className="accordion-count">{heroes.length}</span>
          <span className="accordion-icon">
            {openSections.heroes ? '▼' : '▶'}
          </span>
        </button>
        {openSections.heroes && (
          <div className="accordion-content">
            <div className="hero-groups-container">
              {gruposHeroes.map(grupo => (
                <div key={grupo} className="hero-group-accordion">
                  <button 
                    className="hero-group-header"
                    onClick={() => toggleHeroGroup(grupo)}
                  >
                    <span className="hero-group-title">{grupo}</span>
                    <span className="hero-group-count">{heroesPorGrupo[grupo].length}</span>
                    <span className="hero-group-icon">
                      {openHeroGroups[grupo] ? '▼' : '▶'}
                    </span>
                  </button>
                  {openHeroGroups[grupo] && (
                    <div className="hero-group-content">
                      <div className="character-list">
                        {heroesPorGrupo[grupo].map(renderizarPersonaje)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Habilidades */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('habilidades')}
        >
          <span className="accordion-title">Habilidades</span>
          <span className="accordion-count">{todasHabilidades.length}</span>
          <span className="accordion-icon">
            {openSections.habilidades ? '▼' : '▶'}
          </span>
        </button>
        {openSections.habilidades && (
          <div className="accordion-content">
            <div className="abilities-list">
              {Object.keys(habilidadesPorCategoria).map(categoria => {
                const habilidadesCategoria = habilidadesPorCategoria[categoria]
                if (habilidadesCategoria.length === 0) return null
                
                return (
                  <div key={categoria} className="ability-category">
                    <h3 className="ability-category-title">
                      {getNombreCategoria(categoria)}
                    </h3>
                    {habilidadesCategoria.map(habilidad => renderizarHabilidad(habilidad, categoria))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lugares */}
      <div className="accordion-section">
        <button 
          className="accordion-header"
          onClick={() => toggleSection('lugares')}
        >
          <span className="accordion-title">Lugares</span>
          <span className="accordion-count">{todosLugares.length}</span>
          <span className="accordion-icon">
            {openSections.lugares ? '▼' : '▶'}
          </span>
        </button>
        {openSections.lugares && (
          <div className="accordion-content">
            <div className="places-list">
              {todosLugares.map(renderizarLugar)}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default AccordionSidebar

