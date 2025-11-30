import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CharacterList from './CharacterList'
import PlacesList from './PlacesList'
import AbilitiesList from './AbilitiesList'
import { obtenerTodosLosPersonajes } from '../data/personajes'
import { obtenerTodosLosLugares } from '../data/lugares'
import { obtenerTodasLasHabilidades } from '../data/habilidades'

// Función para detectar menciones en el texto (personajes, lugares, habilidades)
const detectarMenciones = (texto) => {
  const regex = /@([A-Za-z0-9\-_]+)/g
  const menciones = {
    personajes: [],
    lugares: [],
    habilidades: []
  }
  let match
  
  const todosPersonajes = obtenerTodosLosPersonajes()
  const todosLugares = obtenerTodosLosLugares()
  const todasHabilidades = obtenerTodasLasHabilidades()
  
  const personajesMap = todosPersonajes.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})
  
  const lugaresMap = todosLugares.reduce((acc, l) => {
    acc[l.id] = l
    return acc
  }, {})
  
  const habilidadesMap = todasHabilidades.reduce((acc, h) => {
    acc[h.id] = h
    return acc
  }, {})
  
  while ((match = regex.exec(texto)) !== null) {
    const id = match[1].toLowerCase()
    if (personajesMap[id]) {
      menciones.personajes.push(id)
    } else if (lugaresMap[id]) {
      menciones.lugares.push(id)
    } else if (habilidadesMap[id]) {
      menciones.habilidades.push(id)
    }
  }
  
  // Eliminar duplicados
  menciones.personajes = [...new Set(menciones.personajes)]
  menciones.lugares = [...new Set(menciones.lugares)]
  menciones.habilidades = [...new Set(menciones.habilidades)]
  
  return menciones
}

// Función para renderizar texto con menciones destacadas
const renderizarTextoConMenciones = (texto) => {
  const regex = /@([A-Za-z0-9\-_]+)/g
  const partes = []
  let ultimoIndice = 0
  let match
  
  const todosPersonajes = obtenerTodosLosPersonajes()
  const todosLugares = obtenerTodosLosLugares()
  const todasHabilidades = obtenerTodasLasHabilidades()
  
  const personajesMap = todosPersonajes.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})
  
  const lugaresMap = todosLugares.reduce((acc, l) => {
    acc[l.id] = l
    return acc
  }, {})
  
  const habilidadesMap = todasHabilidades.reduce((acc, h) => {
    acc[h.id] = h
    return acc
  }, {})
  
  while ((match = regex.exec(texto)) !== null) {
    // Agregar texto antes de la mención
    if (match.index > ultimoIndice) {
      partes.push({
        tipo: 'texto',
        contenido: texto.substring(ultimoIndice, match.index)
      })
    }
    
    const id = match[1].toLowerCase()
    const personaje = personajesMap[id]
    const lugar = lugaresMap[id]
    const habilidad = habilidadesMap[id]
    
    if (personaje) {
      partes.push({
        tipo: 'mencion',
        contenido: `@${match[1]}`,
        id: id,
        tipoMencion: 'personaje',
        item: personaje
      })
    } else if (lugar) {
      partes.push({
        tipo: 'mencion',
        contenido: `@${match[1]}`,
        id: id,
        tipoMencion: 'lugar',
        item: lugar
      })
    } else if (habilidad) {
      partes.push({
        tipo: 'mencion',
        contenido: `@${match[1]}`,
        id: id,
        tipoMencion: 'habilidad',
        item: habilidad
      })
    } else {
      partes.push({
        tipo: 'texto',
        contenido: match[0]
      })
    }
    
    ultimoIndice = match.index + match[0].length
  }
  
  // Agregar texto restante
  if (ultimoIndice < texto.length) {
    partes.push({
      tipo: 'texto',
      contenido: texto.substring(ultimoIndice)
    })
  }
  
  if (partes.length === 0) {
    return [{ tipo: 'texto', contenido: texto }]
  }
  
  return partes
}

function Diary() {
  const [texto, setTexto] = useState('')
  const [entradas, setEntradas] = useState([])
  const [entradaEditando, setEntradaEditando] = useState(null)
  const [sugerencias, setSugerencias] = useState([])
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0)
  const [posicionAutocompletado, setPosicionAutocompletado] = useState(null)
  const textareaRef = useRef(null)
  
  // Cargar entradas del localStorage al montar
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
  
  // Guardar entradas en localStorage cuando cambien
  useEffect(() => {
    if (entradas.length > 0) {
      localStorage.setItem('diarioEntradas', JSON.stringify(entradas))
    }
  }, [entradas])
  
  const handleGuardar = () => {
    if (texto.trim() === '') return
    
    const menciones = detectarMenciones(texto)
    
    if (entradaEditando) {
      // Actualizar entrada existente
      const entradaActualizada = {
        ...entradaEditando,
        text: texto,
        mentions: menciones,
        dateEdited: new Date().toISOString()
      }
      
      setEntradas(entradas.map(entrada => 
        entrada.id === entradaEditando.id ? entradaActualizada : entrada
      ))
      setEntradaEditando(null)
    } else {
      // Crear nueva entrada
      const nuevaEntrada = {
        id: Date.now().toString(),
        text: texto,
        date: new Date().toISOString(),
        mentions: menciones
      }
      
      setEntradas([nuevaEntrada, ...entradas])
    }
    
    setTexto('')
  }
  
  const handleEditar = (entrada) => {
    setTexto(entrada.text)
    setEntradaEditando(entrada)
    // Scroll al editor
    document.querySelector('.diary-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  const handleCancelarEdicion = () => {
    setTexto('')
    setEntradaEditando(null)
  }
  
  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta entrada?')) {
      setEntradas(entradas.filter(entrada => entrada.id !== id))
      // Si se elimina la entrada que se está editando, cancelar edición
      if (entradaEditando && entradaEditando.id === id) {
        handleCancelarEdicion()
      }
    }
  }

  // Función para obtener todas las opciones de autocompletado
  const obtenerOpcionesAutocompletado = () => {
    const todosPersonajes = obtenerTodosLosPersonajes()
    const todosLugares = obtenerTodosLosLugares()
    const todasHabilidades = obtenerTodasLasHabilidades()
    
    const opciones = []
    
    // Agregar personajes
    todosPersonajes.forEach(personaje => {
      opciones.push({
        id: personaje.id,
        nombre: personaje.nombre,
        tipo: 'personaje',
        tipoDisplay: personaje.tipo,
        grupo: personaje.grupo
      })
    })
    
    // Agregar lugares
    todosLugares.forEach(lugar => {
      opciones.push({
        id: lugar.id,
        nombre: lugar.nombre,
        tipo: 'lugar',
        tipoDisplay: 'lugar'
      })
    })
    
    // Agregar habilidades
    todasHabilidades.forEach(habilidad => {
      opciones.push({
        id: habilidad.id,
        nombre: habilidad.nombre,
        tipo: 'habilidad',
        tipoDisplay: habilidad.categoria || 'habilidad'
      })
    })
    
    return opciones
  }

  // Función para buscar sugerencias basadas en el texto después de "@"
  const buscarSugerencias = (textoCompleto, posicionCursor) => {
    // Buscar el "@" más cercano antes del cursor
    let inicioBusqueda = posicionCursor - 1
    while (inicioBusqueda >= 0 && textoCompleto[inicioBusqueda] !== '@' && textoCompleto[inicioBusqueda] !== ' ') {
      inicioBusqueda--
    }
    
    if (inicioBusqueda < 0 || textoCompleto[inicioBusqueda] !== '@') {
      return { sugerencias: [], posicion: null }
    }
    
    // Obtener el texto después del "@"
    const textoBusqueda = textoCompleto.substring(inicioBusqueda + 1, posicionCursor).toLowerCase()
    
    // Si hay un espacio, no mostrar sugerencias
    if (textoBusqueda.includes(' ')) {
      return { sugerencias: [], posicion: null }
    }
    
    const todasOpciones = obtenerOpcionesAutocompletado()
    
    // Filtrar opciones que coincidan con el texto
    const sugerenciasFiltradas = todasOpciones.filter(opcion => 
      opcion.nombre.toLowerCase().includes(textoBusqueda) ||
      opcion.id.toLowerCase().includes(textoBusqueda)
    ).slice(0, 10) // Limitar a 10 sugerencias
    
    return {
      sugerencias: sugerenciasFiltradas,
      posicion: { inicio: inicioBusqueda + 1, fin: posicionCursor }
    }
  }

  const handleTextoChange = (e) => {
    const nuevoTexto = e.target.value
    const posicionCursor = e.target.selectionStart
    
    setTexto(nuevoTexto)
    
    // Buscar sugerencias
    const { sugerencias, posicion } = buscarSugerencias(nuevoTexto, posicionCursor)
    
    if (sugerencias.length > 0 && posicion) {
      setSugerencias(sugerencias)
      setPosicionAutocompletado(posicion)
      setIndiceSeleccionado(0)
    } else {
      setSugerencias([])
      setPosicionAutocompletado(null)
    }
  }

  const insertarSugerencia = (sugerencia) => {
    if (!posicionAutocompletado) return
    
    const textoAntes = texto.substring(0, posicionAutocompletado.inicio - 1)
    const textoDespues = texto.substring(posicionAutocompletado.fin)
    const nuevoTexto = textoAntes + '@' + sugerencia.id + ' ' + textoDespues
    
    setTexto(nuevoTexto)
    setSugerencias([])
    setPosicionAutocompletado(null)
    
    // Enfocar el textarea y posicionar el cursor después de la mención
    setTimeout(() => {
      if (textareaRef.current) {
        const nuevaPosicion = textoAntes.length + sugerencia.id.length + 2
        textareaRef.current.setSelectionRange(nuevaPosicion, nuevaPosicion)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (sugerencias.length === 0) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndiceSeleccionado((prev) => (prev + 1) % sugerencias.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceSeleccionado((prev) => (prev - 1 + sugerencias.length) % sugerencias.length)
    } else if (e.key === 'Enter' && sugerencias.length > 0) {
      e.preventDefault()
      insertarSugerencia(sugerencias[indiceSeleccionado])
    } else if (e.key === 'Escape') {
      setSugerencias([])
      setPosicionAutocompletado(null)
    }
  }

  // Función para obtener color según tipo
  const getTipoColor = (tipo) => {
    const colores = {
      "personaje": "#60a5fa",
      "lugar": "#34d399",
      "habilidad": "#a78bfa",
    }
    return colores[tipo] || "#94a3b8"
  }

  // Función para obtener inicial
  const getInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase()
  }
  
  return (
    <div className="diary-container">
      <div className="sidebar-container">
        <CharacterList entradas={entradas} />
        <PlacesList entradas={entradas} />
        <AbilitiesList entradas={entradas} />
      </div>
      
      <main className="diary-main">
        <div className="diary-header">
          <div className="header-top">
            <div>
              <h1>Diario de Conexión</h1>
              <p className="subtitle">Escribe tus pensamientos y menciona a tus guías usando @id</p>
            </div>
            <Link to="/admin" className="btn-admin">
              ⚙️ Administrar Personajes
            </Link>
          </div>
        </div>
        
        <div className="diary-editor">
          {entradaEditando && (
            <div className="editing-indicator">
              <span>✏️ Editando entrada del {new Date(entradaEditando.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          )}
          <div className="textarea-container" style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              className="diary-textarea"
              placeholder="Escribe aquí... Usa @jesus, @aang, @planeta-tierra, @meditacion, etc. para mencionar personajes, lugares o habilidades."
              value={texto}
              onChange={handleTextoChange}
              onKeyDown={handleKeyDown}
              rows={10}
            />
            {sugerencias.length > 0 && (
              <div className="autocomplete-dropdown">
                {sugerencias.map((sugerencia, index) => (
                  <div
                    key={`${sugerencia.tipo}-${sugerencia.id}`}
                    className={`autocomplete-item ${index === indiceSeleccionado ? 'selected' : ''}`}
                    onClick={() => insertarSugerencia(sugerencia)}
                    onMouseEnter={() => setIndiceSeleccionado(index)}
                  >
                    {sugerencia.tipo === 'personaje' && (
                      <div className="autocomplete-avatar" style={{ backgroundColor: getTipoColor('personaje') }}>
                        {getInicial(sugerencia.nombre)}
                      </div>
                    )}
                    {sugerencia.tipo === 'lugar' && (
                      <div className="autocomplete-avatar" style={{ backgroundColor: getTipoColor('lugar') }}>
                        {getInicial(sugerencia.nombre)}
                      </div>
                    )}
                    {sugerencia.tipo === 'habilidad' && (
                      <div className="autocomplete-avatar" style={{ backgroundColor: getTipoColor('habilidad') }}>
                        {getInicial(sugerencia.nombre)}
                      </div>
                    )}
                    <div className="autocomplete-info">
                      <div className="autocomplete-name">{sugerencia.nombre}</div>
                      <div className="autocomplete-meta">
                        <span className="autocomplete-type">{sugerencia.tipo}</span>
                        {sugerencia.grupo && (
                          <span className="autocomplete-group">• {sugerencia.grupo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="editor-actions">
            {entradaEditando && (
              <button 
                className="btn-cancelar-edicion"
                onClick={handleCancelarEdicion}
              >
                Cancelar
              </button>
            )}
            <button 
              className="btn-guardar"
              onClick={handleGuardar}
              disabled={texto.trim() === ''}
            >
              {entradaEditando ? 'Actualizar Entrada' : 'Guardar Entrada'}
            </button>
          </div>
        </div>
        
        <div className="diary-entries">
          <h2>Entradas Anteriores</h2>
          {entradas.length === 0 ? (
            <p className="no-entries">No hay entradas aún. ¡Comienza a escribir!</p>
          ) : (
            entradas.map(entrada => {
              const partes = renderizarTextoConMenciones(entrada.text)
              const fecha = new Date(entrada.date)
              
              return (
                <div key={entrada.id} className="diary-entry">
                  <div className="entry-header">
                    <span className="entry-date">
                      {fecha.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {entrada.dateEdited && (
                        <span className="entry-edited"> (editada)</span>
                      )}
                    </span>
                    <div className="entry-actions">
                      <button
                        className="btn-editar-entrada"
                        onClick={() => handleEditar(entrada)}
                        disabled={entradaEditando && entradaEditando.id === entrada.id}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleEliminar(entrada.id)}
                        disabled={entradaEditando && entradaEditando.id === entrada.id}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="entry-content">
                    {partes.map((parte, index) => {
                      if (parte.tipo === 'mencion') {
                        const ruta = parte.tipoMencion === 'personaje' 
                          ? `/personaje/${parte.id}`
                          : parte.tipoMencion === 'lugar'
                          ? `/lugar/${parte.id}`
                          : `/habilidad/${parte.id}`
                        
                        return (
                          <Link
                            key={index}
                            to={ruta}
                            className={`mention-link mention-${parte.tipoMencion}`}
                          >
                            {parte.contenido}
                          </Link>
                        )
                      }
                      return <span key={index}>{parte.contenido}</span>
                    })}
                  </div>
                  {(entrada.mentions?.personajes?.length > 0 || 
                    entrada.mentions?.lugares?.length > 0 || 
                    entrada.mentions?.habilidades?.length > 0) && (
                    <div className="entry-mentions">
                      {entrada.mentions?.personajes?.length > 0 && (
                        <div>
                          <strong>Personajes:</strong>{' '}
                          {entrada.mentions.personajes.map((id, idx) => {
                            const todosPersonajes = obtenerTodosLosPersonajes()
                            const personaje = todosPersonajes.find(p => p.id === id)
                            return (
                              <span key={id}>
                                <Link to={`/personaje/${id}`} className="mention-tag mention-personaje">
                                  {personaje?.nombre || id}
                                </Link>
                                {idx < entrada.mentions.personajes.length - 1 && ', '}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      {entrada.mentions?.lugares?.length > 0 && (
                        <div>
                          <strong>Lugares:</strong>{' '}
                          {entrada.mentions.lugares.map((id, idx) => {
                            const todosLugares = obtenerTodosLosLugares()
                            const lugar = todosLugares.find(l => l.id === id)
                            return (
                              <span key={id}>
                                <Link to={`/lugar/${id}`} className="mention-tag mention-lugar">
                                  {lugar?.nombre || id}
                                </Link>
                                {idx < entrada.mentions.lugares.length - 1 && ', '}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      {entrada.mentions?.habilidades?.length > 0 && (
                        <div>
                          <strong>Habilidades:</strong>{' '}
                          {entrada.mentions.habilidades.map((id, idx) => {
                            const todasHabilidades = obtenerTodasLasHabilidades()
                            const habilidad = todasHabilidades.find(h => h.id === id)
                            return (
                              <span key={id}>
                                <Link to={`/habilidad/${id}`} className="mention-tag mention-habilidad">
                                  {habilidad?.nombre || id}
                                </Link>
                                {idx < entrada.mentions.habilidades.length - 1 && ', '}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

export default Diary

