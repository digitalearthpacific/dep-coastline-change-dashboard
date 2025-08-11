import { useEffect, useState } from 'react'
import useResponsive from '../../library/hooks/useResponsive'
import { Flex, Grid } from '@radix-ui/themes'
import type { MockCoastLineChangeData, PacificCountry } from '../../library/types'
import { ShorelineChangeCard } from '../ShoreLineChangeCard/ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard/HotSpotsCard'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import { BuildingCard } from '../BuildingCard/BuildingCard'
import TextButton from '../TextButton/TextButton'

type CountryResultViewProps = {
  selectedCountry: PacificCountry | null
  countryData: MockCoastLineChangeData | null
  goToHotSpotView: () => void
}

export const CountryResultView = ({
  selectedCountry,
  countryData,
  goToHotSpotView,
}: CountryResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line'>('line')

  useEffect(() => {
    setStartDate('')
    setEndDate('')
    setSelectedChartType('line')
  }, [selectedCountry])

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

  return (
    <>
      <Flex direction='row-reverse' gap='4' py='3'>
        <TextButton
          ariaLabel='View Background Information'
          disabled
          onClick={() => alert('Clicked!')}
        >
          VIEW BACKGROUND INFORMATION
        </TextButton>
        <TextButton ariaLabel='View Hot Spot Information' onClick={goToHotSpotView}>
          HOT SPOT VIEW
        </TextButton>
      </Flex>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard shorelineChange={countryData?.shorelineChange} />
        <HotSpotsCard hotSpots={countryData?.hotSpots} />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard population={countryData?.population} />
        <BuildingCard buildings={countryData?.buildings} />
        <MangrovesCard mangroves={countryData?.mangroves} />
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
}
