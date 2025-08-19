import { useEffect, useState } from 'react'
import useResponsive from '../../hooks/useResponsive'
import { Flex, Grid } from '@radix-ui/themes'
import type { ChartType, DateType, MockCoastLineChangeData } from '../../library/types'
import { ShorelineChangeCard } from '../ShoreLineChangeCard/ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard/HotSpotsCard'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import { BuildingCard } from '../BuildingCard/BuildingCard'
import TextButton from '../TextButton/TextButton'
import { NONE_VALUE } from '../../library/constants'
import { useCountry } from '../../hooks/useCountry'

type CountryResultViewProps = {
  countryData: MockCoastLineChangeData | null
  goToHotSpotView: () => void
  goToBackgroundInfoView: () => void
}

export const CountryResultView = ({
  countryData,
  goToHotSpotView,
  goToBackgroundInfoView,
}: CountryResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const { selectedCountry } = useCountry()
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line')

  useEffect(() => {
    setStartDate(null)
    setEndDate(null)
    setSelectedChartType('line')
  }, [selectedCountry])

  const handleDateChange = (dateType: DateType, value: string) => {
    if (value === NONE_VALUE) {
      setStartDate(null)
      setEndDate(null)
      return
    }

    if (dateType === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const handleChartTypeChange = (type: ChartType) => {
    setSelectedChartType(type)
  }

  return (
    <>
      <Flex direction={isMobileWidth ? 'column-reverse' : 'row-reverse'} gap='4' py='3'>
        <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
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
