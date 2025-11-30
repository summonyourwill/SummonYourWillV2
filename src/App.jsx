import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Diary from './components/Diary'
import CharacterProfile from './components/CharacterProfile'
import PlaceProfile from './components/PlaceProfile'
import AbilityProfile from './components/AbilityProfile'
import AdminCharacters from './components/AdminCharacters'
import './styles.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Diary />} />
          <Route path="/personaje/:id" element={<CharacterProfile />} />
          <Route path="/lugar/:id" element={<PlaceProfile />} />
          <Route path="/habilidad/:id" element={<AbilityProfile />} />
          <Route path="/admin" element={<AdminCharacters />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

