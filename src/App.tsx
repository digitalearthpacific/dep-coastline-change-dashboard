import { Routes, Route } from 'react-router-dom'
import { MapProvider } from 'react-map-gl/maplibre'
import { CountryProvider } from './contexts/CountryContext'
import { Dashboard } from './components/Dashboard'
import { ChartProvider } from './contexts/ChartContext'

export const App = () => {
  return (
    <CountryProvider>
      <ChartProvider>
        <MapProvider>
          <Routes>
            <Route path='/' element={<Dashboard />} />
          </Routes>
        </MapProvider>
      </ChartProvider>
    </CountryProvider>
  )
}

export default App
