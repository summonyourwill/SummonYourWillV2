import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Diary from './components/Diary'
import CharacterProfile from './components/CharacterProfile'
import PlaceProfile from './components/PlaceProfile'
import AbilityProfile from './components/AbilityProfile'
import MissionProfile from './components/MissionProfile'
import AdminCharacters from './components/AdminCharacters'
import AdminPlaces from './components/AdminPlaces'
import AdminAbilities from './components/AdminAbilities'
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
          <Route path="/mision/:id" element={<MissionProfile />} />
          <Route path="/admin" element={<AdminCharacters />} />
          <Route path="/admin/lugares" element={<AdminPlaces />} />
          <Route path="/admin/habilidades" element={<AdminAbilities />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

