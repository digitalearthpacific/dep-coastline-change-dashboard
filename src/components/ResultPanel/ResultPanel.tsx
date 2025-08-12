import { useState, useEffect } from 'react'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import useResponsive from '../../library/hooks/useResponsive'
import type { MockCoastLineChangeData, ResultPanelProps } from '../../library/types'
import styles from './ResultPanel.module.scss'
import { ErrorCard } from '../ErrorCard/ErrorCard'
import { CountryResultView } from '../CountryResultView/CountryResultView'
import { LocationCard } from '../LocationCard/LocationCard'
import { HotSpotResultView } from '../HotSpotResultView/HotSpotResultView'

/** TODO: Remove Mock data generation for coastline change statistics */
function generateRandomNumber(length: number, maxTo?: number): number {
  if (length < 1) return 0
  const min = Math.pow(10, length - 1)
  let max = Math.pow(10, length) - 1
  if (maxTo !== undefined && maxTo < max) {
    max = Math.max(min, maxTo)
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getMockCountryData(): MockCoastLineChangeData {
  return {
    shorelineChange: {
      retreat: generateRandomNumber(2, 100),
      growth: generateRandomNumber(2, 100),
      stable: generateRandomNumber(2, 100),
    },
    hotSpots: {
      highChange: generateRandomNumber(3, 1000),
      moderateChange: generateRandomNumber(3, 1000),
      lowChange: generateRandomNumber(3, 1000),
    },
    population: generateRandomNumber(7, 10000000),
    buildings: generateRandomNumber(5, 100000),
    mangroves: generateRandomNumber(5, 100000),
  }
}

function getMockHotSpotData(): MockCoastLineChangeData {
  return {
    shorelineChange: {
      retreat: generateRandomNumber(2, 100),
      growth: generateRandomNumber(2, 100),
      stable: generateRandomNumber(2, 100),
    },
    hotSpotIndicator: generateRandomNumber(1, 10),
    population: generateRandomNumber(7, 10000000),
    buildings: generateRandomNumber(5, 100000),
    mangroves: generateRandomNumber(5, 100000),
  }
}
/** End of Mock data generation for coastline change statistics */

export const ResultPanel = ({ selectedCountry, isMobilePanelOpen }: ResultPanelProps) => {
  const { isMobileWidth } = useResponsive()
  const [countryData, setCountryData] = useState<MockCoastLineChangeData>({})
  const [hotSpotData, setHotSpotData] = useState<MockCoastLineChangeData>({})
  const [resultPanelView, setResultPanelView] = useState<'country' | 'hot spot'>('country')

  useEffect(() => {
    const mockData = selectedCountry?.name === 'Error Country' ? null : getMockCountryData()
    setCountryData(mockData ?? {})
  }, [selectedCountry])

  if (!selectedCountry) return null

  const handleResultPanelViewChange = (view: 'country' | 'hot spot') => {
    setResultPanelView(view)
  }

  const goToHotSpotView = () => {
    const mockHotSpotData = getMockHotSpotData()
    setHotSpotData(mockHotSpotData)
    handleResultPanelViewChange('hot spot')
  }

  const goToCountryView = () => {
    handleResultPanelViewChange('country')
  }

  const content =
    selectedCountry?.name === 'Error Country' ? (
      <ErrorCard />
    ) : (
      <>
        <LocationCard selectedCountry={selectedCountry} />
        {resultPanelView === 'country' ? (
          <CountryResultView
            selectedCountry={selectedCountry}
            countryData={countryData}
            goToHotSpotView={goToHotSpotView}
          />
        ) : (
          <HotSpotResultView
            selectedCountry={selectedCountry}
            hotSpotData={hotSpotData}
            goToCountryView={goToCountryView}
          />
        )}
      </>
    )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
