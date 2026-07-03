import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Calculator from './pages/Calculator'
import PostProperty from './pages/PostProperty'
import MapView from './pages/MapView'
import Dashboard from './pages/Dashboard'
import LekhapadhiDirectory from './pages/LekhapadhiDirectory'
import LekhapadhiProfile from './pages/LekhapadhiProfile'
import LekhapadhiDetail from './pages/LekhapadhiDetail'
import AdminDashboard from './pages/AdminDashboard'
import Favorites from './pages/Favorites'
import EditProperty from './pages/EditProperty'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/post-property" element={<PostProperty />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/lekhapadhi" element={<LekhapadhiDirectory />} />
      <Route path="/lekhapadhi/:id" element={<LekhapadhiDetail />} />
      <Route path="/lekhapadhi-profile" element={<LekhapadhiProfile />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/properties/:id/edit" element={<EditProperty />} />
    </Routes>
  )
}

export default App