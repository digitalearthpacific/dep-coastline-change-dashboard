import { useState } from 'react'
import { MainMap } from '../MainMap'
import { SearchBar } from '../SearchBar'
import type { PacificCountry, FlyToLocation } from '../../library/types'
import styles from './Dashboard.module.scss'
import { ResultPanel } from '../ResultPanel'
import useResponsive from '../../library/hooks/useResponsive'

export const Dashboard = () => {
  const { isMobileWidth } = useResponsive()
  const [selectedCountry, setSelectedCountry] = useState<PacificCountry | null>(null)
  const [flyToLocation, setFlyToLocation] = useState<FlyToLocation | null>(null)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  const handleCountrySelect = (country: PacificCountry) => {
    const { coordinates } = country

    setSelectedCountry(country)
    setFlyToLocation({
      center: coordinates,
    })

    if (isMobileWidth) {
      setIsMobilePanelOpen(true)
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <SearchBar selectedCountry={selectedCountry} onCountrySelect={handleCountrySelect} />
      <MainMap flyToLocation={flyToLocation} selectedCountry={selectedCountry} />
      <ResultPanel selectedCountry={selectedCountry} isMobilePanelOpen={isMobilePanelOpen} />
    </div>
  )
}
