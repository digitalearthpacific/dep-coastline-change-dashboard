import { Routes, Route } from 'react-router-dom'
import { MapProvider } from 'react-map-gl/maplibre'
import { CountryProvider } from './contexts/CountryContext'
import { Dashboard } from './components/Dashboard'
import { PACIFIC_COUNTRIES } from './library/constants' // Your countries data

export const App = () => {
  return (
    <CountryProvider countries={[...PACIFIC_COUNTRIES]}>
      <MapProvider>
        <Routes>
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </MapProvider>
    </CountryProvider>
  )
}

export default App
