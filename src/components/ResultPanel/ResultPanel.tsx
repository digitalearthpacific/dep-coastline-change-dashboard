import { useState, useEffect } from 'react'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import useResponsive from '../../hooks/useResponsive'
import styles from './ResultPanel.module.scss'
import { ErrorCard } from '../ErrorCard'
import { CountryResultView } from '../CountryResultView'
import { HotSpotResultView } from '../HotSpotResultView'
import { BackgroundInformationView } from '../BackgroundInformationView'
import { UserGuideView } from '../UserGuideView'
import { GlossaryView } from '../GlossaryView'
import { useMapData } from '../../hooks/useGlobalContext'
import type { ContiguousHotspotProperties } from '../../library/types'

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
  const [viewGlossary, setViewGlossary] = useState(false)
  const [viewUserGuide, setViewUserGuide] = useState(false)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  useEffect(() => {
    if (selectedCountryFeature || selectedHotspotData) {
      setIsMobilePanelOpen(true)
      setViewBackgroundInfo(false)
      setViewGlossary(false)
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

  const goToCountryView = () => {
    handleHotspotDataChange(null)
    handleResultPanelViewChange('country')
  }

  const goBackToResultView = () => {
    setViewBackgroundInfo(false)
    setViewUserGuide(false)
    setViewGlossary(false)
  }

  const goToBackgroundInfoView = () => {
    setViewBackgroundInfo(true)
  }

  const goToGlossaryView = () => {
    setViewGlossary(true)
  }

  const goToUserGuideView = () => {
    setViewUserGuide(true)
  }

  const resultViewContent = () => {
    if (resultPanelView === 'country') {
      return (
        <CountryResultView
          goToBackgroundInfoView={goToBackgroundInfoView}
          goToGlossaryView={goToGlossaryView}
          goToUserGuideView={goToUserGuideView}
        />
      )
    }

    if (resultPanelView === 'hotspot') {
      return (
        <HotSpotResultView
          selectedHotspotData={selectedHotspotData}
          goToCountryView={goToCountryView}
          goToBackgroundInfoView={goToBackgroundInfoView}
          goToGlossaryView={goToGlossaryView}
          goToUserGuideView={goToUserGuideView}
        />
      )
    }

    return <ErrorCard />
  }

  const getContent = () => {
    if (viewBackgroundInfo) {
      return <BackgroundInformationView goBackToResultView={goBackToResultView} />
    }

    if (viewUserGuide) {
      return <UserGuideView goBackToResultView={goBackToResultView} />
    }

    if (viewGlossary) {
      return <GlossaryView goBackToResultView={goBackToResultView} />
    }

    return resultViewContent()
  }

  const content = getContent()

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
