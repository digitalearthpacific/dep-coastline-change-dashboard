import { Callout } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import { MainMap } from '../MainMap'
import { ResultPanel } from '../ResultPanel'
import { SearchBar } from '../SearchBar'
import styles from './Dashboard.module.scss'
import { useCountry } from '../../hooks/useGlobalContext'
import { useSessionStorage } from '../../hooks/useSessionStorage'
import type {
  ContiguousHotspotProperties,
  CountryGeoJSONFeature,
} from '../../library/types/countryGeoJsonTypes'

const COUNTRY_DATA_URL =
  'https://dep-public-staging.s3.us-west-2.amazonaws.com/dep_ls_coastlines/dashboard_stats/0-0-1/country_summaries.geojson'

const sanitizeGeoJSONResponse = (responseText: string): string => {
  return responseText.replace(/:\s*NaN/g, ': null')
}

const fetchCountryData = async (): Promise<CountryGeoJSONFeature[]> => {
  try {
    const response = await fetch(COUNTRY_DATA_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch country data: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    const sanitizedText = sanitizeGeoJSONResponse(responseText)
    const data = JSON.parse(sanitizedText)

    return data?.features || []
  } catch (error) {
    console.error('Error fetching GeoJSON:', error)
    return []
  }
}

export const Dashboard = () => {
  const { setCountryApiData } = useCountry()
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
