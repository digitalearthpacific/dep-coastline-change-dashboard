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
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleCountrySelect = (country: PacificCountry | null) => {
    setSelectedCountry(country)
    setIsMobilePanelOpen(!!country)

    if (country) {
      setFlyToLocation({ center: country.coordinates })
    } else {
      setFlyToLocation(null)
    }
  }

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev)
  }

  const handleFullscreenExit = () => setIsFullscreen(false)

  return (
    <div className={styles.dashboardContainer}>
      {!isFullscreen && (
        <SearchBar selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      )}
      <MainMap
        flyToLocation={flyToLocation}
        selectedCountry={selectedCountry}
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        onFullscreenExit={handleFullscreenExit}
      />
      {!isFullscreen && (
        <ResultPanel selectedCountry={selectedCountry} isMobilePanelOpen={isMobilePanelOpen} />
      )}
    </div>
  )
}
