import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddMissionModal({ personaje, onClose, onSave }) {
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('pendiente')
  const [prioridad, setPrioridad] = useState('media')

  const handleGuardar = () => {
    if (!titulo.trim()) {
      alert('El título es requerido')
      return
    }

    // Crear misión en el sistema centralizado
    const nuevaMision = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      estado: estado,
      prioridad: prioridad,
      personajesIds: personaje ? [personaje.id] : [],
      fechaCreacion: new Date().toISOString()
    }

    // Guardar en localStorage
    const misiones = JSON.parse(localStorage.getItem('misiones') || '[]')
    const misionesActualizadas = [...misiones, nuevaMision]
    localStorage.setItem('misiones', JSON.stringify(misionesActualizadas))

    // Llamar al callback para actualizar el componente padre
    onSave(nuevaMision)
    
    setTitulo('')
    setDescripcion('')
    setEstado('pendiente')
    setPrioridad('media')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Misión para {personaje?.nombre}</h2>
          <button className="btn-cerrar" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Título de la Misión *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Meditar 10 minutos diarios"
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe la misión en detalle..."
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          <div className="form-group">
            <label>Prioridad</label>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-guardar" onClick={handleGuardar}>
              Guardar Misión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMissionModal


