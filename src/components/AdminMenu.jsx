import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleOptionClick = (route) => {
    navigate(route)
    setIsOpen(false)
  }

  return (
    <div className="admin-menu-container" ref={menuRef}>
      <button 
        className="btn-admin"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ Administrar
      </button>
      
      {isOpen && (
        <div className="admin-menu-dropdown">
          <button
            className="admin-menu-item"
            onClick={() => handleOptionClick('/admin')}
          >
            Personajes
          </button>
          <button
            className="admin-menu-item"
            onClick={() => handleOptionClick('/admin/lugares')}
          >
            Lugares
          </button>
          <button
            className="admin-menu-item"
            onClick={() => handleOptionClick('/admin/habilidades')}
          >
            Habilidades
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminMenu

