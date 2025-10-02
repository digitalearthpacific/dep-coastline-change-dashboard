import useResponsive from '../../hooks/useResponsive'
import { Badge, Flex, Grid } from '@radix-ui/themes'
import { PopulationCard } from '../PopulationCard'
import { MangrovesCard } from '../MangrovesCard'
import { BuildingsCard } from '../BuildingsCard'
import { TextButton } from '../TextButton'
import type { ContiguousHotspotProperties } from '../../library/types'
import { DateRangeSelect } from '../DateRangeSelect/DateRangeSelect'
import { HotspotAreaCard } from '../HotspotAreaCard/HotspotAreaCard'
import { RETREAT_VALUES, GROWTH_VALUES } from '../../library/constants'
import { BackButton } from '../BackButton'

type HotSpotResultViewProps = {
  selectedHotspotData: ContiguousHotspotProperties | null
  goToCountryView: () => void
  goToBackgroundInfoView: () => void
}

const HotSpotBadge = ({ rateOfChange }: { rateOfChange: number | null }) => {
  if (rateOfChange === null) return null

  // Exact value matching for retreats
  if (rateOfChange === RETREAT_VALUES.HIGH) {
    return (
      <Badge size='3' style={{ backgroundColor: '#CC5803', color: '#ffffff' }}>
        Retreat High Change (&gt;5 m)
      </Badge>
    )
  }

  if (rateOfChange === RETREAT_VALUES.MODERATE) {
    return (
      <Badge size='3' style={{ backgroundColor: '#FF9E1B', color: '#ffffff' }}>
        Retreat Moderate Change (&gt;3 m)
      </Badge>
    )
  }

  if (rateOfChange === RETREAT_VALUES.LOW) {
    return (
      <Badge size='3' style={{ backgroundColor: '#FFD27F', color: '#773404' }}>
        Retreat Low Change (&gt;2 m)
      </Badge>
    )
  }

  // Exact value matching for growth
  if (rateOfChange === GROWTH_VALUES.HIGH) {
    return (
      <Badge size='3' style={{ backgroundColor: '#007BFF', color: '#ffffff' }}>
        Growth High Change (&gt;5 m)
      </Badge>
    )
  }

  if (rateOfChange === GROWTH_VALUES.MODERATE) {
    return (
      <Badge size='3' style={{ backgroundColor: '#59ACFF', color: '#ffffff' }}>
        Growth Moderate Change (&gt;3 m)
      </Badge>
    )
  }

  if (rateOfChange === GROWTH_VALUES.LOW) {
    return (
      <Badge size='3' style={{ backgroundColor: '#97DFFF', color: '#00448C' }}>
        Growth Low Change (&gt;2 m)
      </Badge>
    )
  }

  // Fallback for no significant change or unexpected values
  return (
    <Badge size='3' style={{ backgroundColor: '#8D8D8D', color: '#ffffff' }}>
      No Significant Change
    </Badge>
  )
}

export const HotSpotResultView = ({
  selectedHotspotData,
  goToCountryView,
  goToBackgroundInfoView,
}: HotSpotResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const totalPopulation = selectedHotspotData?.total_population ?? null
  const numberOfBuildings = selectedHotspotData?.building_counts ?? null
  const mangroveArea = selectedHotspotData?.mangrove_area_ha ?? null
  const rateOfChange = selectedHotspotData?.rate_time ?? null
  const hotspotArea = selectedHotspotData?.area_ha ?? null

  return (
    <>
      <BackButton onClick={goToCountryView} />
      <Flex direction={isMobileWidth ? 'column' : 'row'} justify='between' align='center' gap='2'>
        <HotSpotBadge rateOfChange={rateOfChange} />
        <Flex direction={isMobileWidth ? 'column' : 'row'} gap='4' py={isMobileWidth ? '3' : '3'}>
          <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
            VIEW BACKGROUND INFORMATION
          </TextButton>
        </Flex>
      </Flex>
      <DateRangeSelect />
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <HotspotAreaCard hotspotArea={hotspotArea} />
        <PopulationCard totalPopulation={totalPopulation} />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <BuildingsCard numberOfBuildings={numberOfBuildings} />
        <MangrovesCard mangroveArea={mangroveArea} />
      </Grid>
    </>
  )
}
