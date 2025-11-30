import { useState } from 'react'

function AddMissionModal({ personaje, onClose, onSave }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [completada, setCompletada] = useState(false)

  const handleGuardar = () => {
    if (!titulo.trim()) {
      alert('El título es requerido')
      return
    }

    const nuevaMision = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completada: completada,
      fechaCreacion: new Date().toISOString()
    }

    onSave(nuevaMision)
    setTitulo('')
    setDescripcion('')
    setCompletada(false)
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
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={completada}
                onChange={(e) => setCompletada(e.target.checked)}
              />
              <span>Marcar como completada</span>
            </label>
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


