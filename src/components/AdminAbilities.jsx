import { useNavigate } from 'react-router-dom'

function AdminAbilities() {
  const navigate = useNavigate()

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1>Administrar Habilidades</h1>
      </div>
      <div className="profile-section">
        <p className="no-interactions">
          La administración de habilidades estará disponible próximamente.
        </p>
      </div>
    </div>
  )
}

export default AdminAbilities

