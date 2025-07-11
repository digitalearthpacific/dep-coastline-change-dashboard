import { MapProvider } from 'react-map-gl/maplibre'
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './components'

const App = () => {
  return (
    <MapProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </MapProvider>
  )
}

export default App
