import { useState } from 'react'
import { MainMap } from '../MainMap'
import { SearchBar } from '../SearchBar'
import type { PacificCountry, FlyToLocation } from '../../library/types'
import styles from './Dashboard.module.scss'
import { ResultPanel } from '../ResultPanel'

export const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState<PacificCountry | null>(null)
  const [flyToLocation, setFlyToLocation] = useState<FlyToLocation | null>(null)

  const handleCountrySelect = (country: PacificCountry) => {
    const { coordinates } = country

    setSelectedCountry(country)
    setFlyToLocation({
      center: coordinates,
    })
  }

  return (
    <div className={styles.dashboardContainer}>
      <SearchBar selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      <MainMap flyToLocation={flyToLocation} selectedCountry={selectedCountry} />
      <ResultPanel selectedCountry={selectedCountry} />
    </div>
  )
}
