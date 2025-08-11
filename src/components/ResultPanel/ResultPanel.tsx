import { useState, useEffect } from 'react'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import useResponsive from '../../library/hooks/useResponsive'
import type { MockCoastLineChangeData, ResultPanelProps } from '../../library/types'
import styles from './Result.module.scss'
import { ErrorCard } from '../ErrorCard/ErrorCard'
import { ResultView } from '../ResultView/ResultView'

// Mock data generation for coastline change statistics, WILL REMOVE LATER
function generateRandomNumber(length: number, maxTo?: number): number {
  if (length < 1) return 0
  const min = Math.pow(10, length - 1)
  let max = Math.pow(10, length) - 1
  if (maxTo !== undefined && maxTo < max) {
    max = Math.max(min, maxTo)
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getMockData(): MockCoastLineChangeData {
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
// End of mock data generation

export const ResultPanel = ({ selectedCountry, isMobilePanelOpen }: ResultPanelProps) => {
  const { isMobileWidth } = useResponsive()
  const [resultData, setResultData] = useState<MockCoastLineChangeData>({})

  useEffect(() => {
    const mockData = selectedCountry?.name === 'Error Country' ? null : getMockData()
    setResultData(mockData ?? {})
  }, [selectedCountry])

  if (!selectedCountry) return null

  const content =
    selectedCountry?.name === 'Error Country' ? (
      <ErrorCard />
    ) : (
      <ResultView selectedCountry={selectedCountry} resultData={resultData} />
    )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
