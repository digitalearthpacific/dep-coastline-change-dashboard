import { useState } from 'react'

import { MainMap } from '../MainMap'
import { ResultPanel } from '../ResultPanel'
import { SearchBar } from '../SearchBar'
import type { FlyToLocation, PacificCountry } from '../../library/types'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState<PacificCountry | null>(null)
  const [flyToLocation, setFlyToLocation] = useState<FlyToLocation | null>(null)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  const handleCountrySelect = (country: PacificCountry) => {
    setSelectedCountry(country)
    setFlyToLocation({
      center: country.coordinates,
    })
    setIsMobilePanelOpen(true)
  }

  return (
    <div className={styles.dashboardContainer}>
      <SearchBar selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      <MainMap flyToLocation={flyToLocation} selectedCountry={selectedCountry} />
      <ResultPanel selectedCountry={selectedCountry} isMobilePanelOpen={isMobilePanelOpen} />
    </div>
  )
}
