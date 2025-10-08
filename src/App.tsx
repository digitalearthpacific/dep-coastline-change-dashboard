import { Routes, Route } from 'react-router-dom'
import { MapProvider } from 'react-map-gl/maplibre'
import { MapDataProvider } from './contexts/MapDataProvider'
import { MapVisualizationProvider } from './contexts/MapVisualizationProvider'
import { Dashboard } from './components/Dashboard'

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
