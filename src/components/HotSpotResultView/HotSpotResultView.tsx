import { useEffect, useState } from 'react'
import useResponsive from '../../library/hooks/useResponsive'
import { Badge, Flex, Grid } from '@radix-ui/themes'
import type {
  ChartType,
  DateType,
  MockCoastLineChangeData,
  PacificCountry,
} from '../../library/types'
import { ShorelineChangeCard } from '../ShoreLineChangeCard/ShoreLineChangeCard'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import { BuildingCard } from '../BuildingCard/BuildingCard'
import TextButton from '../TextButton/TextButton'
import { NONE_VALUE } from '../../library/constants'

type HotSpotResultViewProps = {
  selectedCountry: PacificCountry | null
  hotSpotData: MockCoastLineChangeData | null
  goToCountryView: () => void
  goToBackgroundInfoView: () => void
}

const HotSpotBadge = ({
  hotSpotIndicator,
}: {
  hotSpotIndicator: MockCoastLineChangeData['hotSpotIndicator'] | null
}) => {
  if (!hotSpotIndicator) return null

  if (hotSpotIndicator > 5) {
    return (
      <Badge size='3' style={{ backgroundColor: 'var(--error-a3)', color: 'var(--error-a11)' }}>
        High Change (&gt;5m)
      </Badge>
    )
  }

  if (hotSpotIndicator >= 3 && hotSpotIndicator <= 5) {
    return (
      <Badge size='3' style={{ backgroundColor: 'var(--warning-a3)', color: 'var(--warning-a11)' }}>
        Moderate Change (&gt;3m)
      </Badge>
    )
  }

  if (hotSpotIndicator > 0) {
    return (
      <Badge size='3' style={{ backgroundColor: 'var(--success-a3)', color: 'var(--success-a11)' }}>
        Low Change (&gt;1m)
      </Badge>
    )
  }

  return null
}

export const HotSpotResultView = ({
  selectedCountry,
  hotSpotData,
  goToCountryView,
  goToBackgroundInfoView,
}: HotSpotResultViewProps) => {
  const { isMobileWidth } = useResponsive()
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
      <Flex direction={isMobileWidth ? 'column' : 'row'} justify='between' align='center' gap='2'>
        <HotSpotBadge hotSpotIndicator={hotSpotData?.hotSpotIndicator} />
        <Flex direction={isMobileWidth ? 'column' : 'row'} gap='4' py={isMobileWidth ? '3' : '3'}>
          <TextButton ariaLabel='View Country Information' onClick={goToCountryView}>
            COUNTRY VIEW
          </TextButton>
          <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
            VIEW BACKGROUND INFORMATION
          </TextButton>
        </Flex>
      </Flex>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard shorelineChange={hotSpotData?.shorelineChange} />
        <PopulationCard population={hotSpotData?.population} />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <BuildingCard buildings={hotSpotData?.buildings} />
        <MangrovesCard mangroves={hotSpotData?.mangroves} />
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
