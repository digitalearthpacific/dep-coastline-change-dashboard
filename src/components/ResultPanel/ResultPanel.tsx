import { useState, useEffect } from 'react'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import useResponsive from '../../hooks/useResponsive'
import styles from './ResultPanel.module.scss'
import { ErrorCard } from '../ErrorCard'
import { CountryResultView } from '../CountryResultView'
import { LocationCard } from '../LocationCard'
import { HotSpotResultView } from '../HotSpotResultView'
import { BackgroundInformationView } from '../BackgroundInformationView'
import { useMapData } from '../../hooks/useGlobalContext'
import type { ContiguousHotspotProperties } from '../../library/types/countryGeoJsonTypes'

export const ResultPanel = ({
  selectedHotspotData,
  handleHotspotDataChange,
}: {
  selectedHotspotData: ContiguousHotspotProperties | null
  handleHotspotDataChange: (hotspotData: ContiguousHotspotProperties | null) => void
}) => {
  const { isMobileWidth } = useResponsive()
  const { selectedCountryFeature } = useMapData()
  const [resultPanelView, setResultPanelView] = useState<'country' | 'hotspot'>('country')
  const [viewBackgroundInfo, setViewBackgroundInfo] = useState(false)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  useEffect(() => {
    if (selectedCountryFeature || selectedHotspotData) {
      setIsMobilePanelOpen(true)
    } else {
      setIsMobilePanelOpen(false)
    }

    if (selectedCountryFeature && !selectedHotspotData) {
      setResultPanelView('country')
    } else {
      setResultPanelView('hotspot')
    }
  }, [selectedCountryFeature, selectedHotspotData])

  if (!selectedCountryFeature && !selectedHotspotData) return null

  const handleResultPanelViewChange = (view: 'country' | 'hotspot') => {
    setResultPanelView(view)
  }

  const goToHotspotView = () => {
    handleResultPanelViewChange('hotspot')
  }

  const goToCountryView = () => {
    handleHotspotDataChange(null)
    handleResultPanelViewChange('country')
  }

  const goBackToResultView = () => {
    setViewBackgroundInfo(false)
  }

  const goToBackgroundInfoView = () => {
    setViewBackgroundInfo(true)
  }

  const resultViewContent = () => {
    if (resultPanelView === 'country') {
      return (
        <>
          <LocationCard />
          <CountryResultView
            selectedHotspotData={selectedHotspotData}
            goToHotspotView={goToHotspotView}
            goToBackgroundInfoView={goToBackgroundInfoView}
          />
        </>
      )
    }

    if (resultPanelView === 'hotspot') {
      return (
        <>
          <LocationCard />
          <HotSpotResultView
            selectedCountryFeature={selectedCountryFeature}
            selectedHotspotData={selectedHotspotData}
            goToCountryView={goToCountryView}
            goToBackgroundInfoView={goToBackgroundInfoView}
          />
        </>
      )
    }

    return <ErrorCard />
  }

  const content = viewBackgroundInfo ? (
    <BackgroundInformationView goBackToResultView={goBackToResultView} />
  ) : (
    resultViewContent()
  )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
