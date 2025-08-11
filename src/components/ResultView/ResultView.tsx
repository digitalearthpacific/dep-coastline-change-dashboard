import { useEffect, useState } from 'react'
import useResponsive from '../../library/hooks/useResponsive'
import { Grid } from '@radix-ui/themes'
import type { MockCoastLineChangeData, PacificCountry } from '../../library/types'
import { LocationCard } from '../LocationCard/LocationCard'
import { ShorelineChangeCard } from '../ShoreLineChangeCard/ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard/HotSpotsCard'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import { BuildingCard } from '../BuildingCard/BuildingCard'

type ResultViewProps = {
  selectedCountry: PacificCountry | null
  resultData: MockCoastLineChangeData | null
}

export const ResultView = ({ selectedCountry, resultData }: ResultViewProps) => {
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
}
