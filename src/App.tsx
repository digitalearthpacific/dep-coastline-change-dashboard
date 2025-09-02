import { Routes, Route } from 'react-router-dom'
import { MapProvider } from 'react-map-gl/maplibre'
import { MapDataProvider } from './contexts/MapDataContext'
import { Dashboard } from './components/Dashboard'
import { MapVisualizationProvider } from './contexts/MapVisualizationContext'

export const App = () => {
  return (
    <MapDataProvider>
      <MapVisualizationProvider>
        <MapProvider>
          <Routes>
            <Route path='/' element={<Dashboard />} />
          </Routes>
        </MapProvider>
      </MapVisualizationProvider>
    </MapDataProvider>
  )
}

export default App
