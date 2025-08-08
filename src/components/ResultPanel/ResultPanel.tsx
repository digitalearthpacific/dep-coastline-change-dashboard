import { useState, useEffect } from 'react'

import { Card, Flex, Grid, Text } from '@radix-ui/themes'
import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import InfoCircledIcon from '../../assets/info-circled.svg'
import useResponsive from '../../library/hooks/useResponsive'
import type { MockCoastLineChangeData, ResultPanelProps } from '../../library/types'
import styles from './Result.module.scss'
import { LocationCard } from '../LocationCard/LocationCard'
import { ShorelineChangeCard } from '../ShoreLineChangeCard/ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard/HotSpotsCard'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import { ErrorCard } from '../ErrorCard/ErrorCard'

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

const BuildingCard = ({
  buildings,
}: {
  buildings: MockCoastLineChangeData['buildings'] | null
}) => (
  <Card>
    <Flex direction='column' gap='5'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Buildings
          </Text>
          <img src={InfoCircledIcon} alt='Information Icon About Buildings' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          Estimated number of buildings in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        {buildings ? buildings.toLocaleString() : '-'}
      </Text>
    </Flex>
  </Card>
)

export const ResultPanel = ({ selectedCountry, isMobilePanelOpen }: ResultPanelProps) => {
  const { isMobileWidth } = useResponsive()
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line'>('line')
  const [resultData, setResultData] = useState<MockCoastLineChangeData>({})

  useEffect(() => {
    const mockData = selectedCountry?.name === 'Error Country' ? null : getMockData()
    setResultData(mockData ?? {})
    setStartDate('')
    setEndDate('')
    setSelectedChartType('line')
  }, [selectedCountry])

  if (!selectedCountry) return null

  const handleDateChange = (dateType: 'start' | 'end', value: string | undefined) => {
    if (dateType === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const handleChartTypeChange = (type: 'bar' | 'line') => {
    setSelectedChartType(type)
  }

  const content =
    selectedCountry?.name === 'Error Country' ? (
      <ErrorCard />
    ) : (
      <>
        <LocationCard selectedCountry={selectedCountry} />
        <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
          <ShorelineChangeCard shorelineChange={resultData?.shorelineChange} />
          <HotSpotsCard hotSpots={resultData?.hotSpots} />
        </Grid>
        <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
          <PopulationCard population={resultData?.population} />
          <BuildingCard buildings={resultData?.buildings} />
          <MangrovesCard mangroves={resultData?.mangroves} />
        </Grid>
        <ChartCard
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          selectedCountry={selectedCountry}
          selectedChartType={selectedChartType}
          onChartTypeChange={handleChartTypeChange}
        />
      </>
    )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
