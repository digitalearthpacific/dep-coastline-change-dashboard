import { Callout } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import { MainMap } from '../MainMap'
import { ResultPanel } from '../ResultPanel'
import { SearchBar } from '../SearchBar'
import styles from './Dashboard.module.scss'
import { useMapData } from '../../hooks/useGlobalContext'
import { useSessionStorage } from '../../hooks/useSessionStorage'
import type { ContiguousHotspotProperties } from '../../library/types'
import { fetchCountryData } from '../../library/utils/fetchCountryData'

export const Dashboard = () => {
  const { setCountryApiData } = useMapData()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedHotspotData, setSelectedHotspotData] =
    useState<ContiguousHotspotProperties | null>(null)
  const [showAlert, setShowAlert] = useSessionStorage('dashboardAlert', true)

  useEffect(() => {
    const loadCountryData = async () => {
      const features = await fetchCountryData()
      setCountryApiData(features)
    }

    loadCountryData()
  }, [setCountryApiData])

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showAlert, setShowAlert])

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev)
  }

  const handleFullscreenExit = () => {
    setIsFullscreen(false)
  }

  const handleHotspotDataChange = (hotspotData: ContiguousHotspotProperties | null) => {
    setSelectedHotspotData(hotspotData)
  }

  return (
    <div className={styles.dashboardContainer}>
      {!isFullscreen && <SearchBar />}
      {!isFullscreen && showAlert && (
        <Callout.Root className={styles.alertBanner}>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Zoom in to see hotspots, shorelines, and map layers</Callout.Text>
        </Callout.Root>
      )}
      <MainMap
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        onFullscreenExit={handleFullscreenExit}
        selectedHotspotData={selectedHotspotData}
        handleHotspotDataChange={handleHotspotDataChange}
      />
      {!isFullscreen && (
        <ResultPanel
          selectedHotspotData={selectedHotspotData}
          handleHotspotDataChange={handleHotspotDataChange}
        />
      )}
    </div>
  )
}
