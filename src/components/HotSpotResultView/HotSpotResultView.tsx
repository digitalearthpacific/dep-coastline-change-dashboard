import useResponsive from '../../hooks/useResponsive'
import { Badge, Flex, Grid } from '@radix-ui/themes'
import { PopulationCard } from '../PopulationCard'
import { MangrovesCard } from '../MangrovesCard'
import { BuildingsCard } from '../BuildingsCard'
import { TextButton } from '../TextButton'
import type { ContiguousHotspotProperties, CountryGeoJSONFeature } from '../../library/types'
import { DateRangeSelect } from '../DateRangeSelect/DateRangeSelect'
import { HotspotAreaCard } from '../HotspotAreaCard/HotspotAreaCard'
import {
  HIGH_CHANGE_THRESHOLD,
  LOW_CHANGE_THRESHOLD,
  MODERATE_CHANGE_THRESHOLD,
} from '../../library/constants'

type HotSpotResultViewProps = {
  selectedCountryFeature: CountryGeoJSONFeature | null
  selectedHotspotData: ContiguousHotspotProperties | null
  goToCountryView: () => void
  goToBackgroundInfoView: () => void
}

const HotSpotBadge = ({ rateOfChange }: { rateOfChange: number | null }) => {
  if (rateOfChange === null) return null

  if (rateOfChange < -HIGH_CHANGE_THRESHOLD) {
    return (
      <Badge size='3' style={{ backgroundColor: '#CC5803', color: '#ffffff' }}>
        Retreat High Change (&gt;5 m)
      </Badge>
    )
  }

  if (rateOfChange < -MODERATE_CHANGE_THRESHOLD) {
    return (
      <Badge size='3' style={{ backgroundColor: '#FF9E1B', color: '#ffffff' }}>
        Retreat Moderate Change (&gt;3 m)
      </Badge>
    )
  }

  if (rateOfChange < -LOW_CHANGE_THRESHOLD) {
    return (
      <Badge size='3' style={{ backgroundColor: '#FFD27F', color: '#773404' }}>
        Retreat Low Change (&gt;2 m)
      </Badge>
    )
  }

  if (rateOfChange > HIGH_CHANGE_THRESHOLD) {
    return (
      <Badge size='3' style={{ backgroundColor: '#007BFF', color: '#ffffff' }}>
        Growth High Change (&gt;5 m)
      </Badge>
    )
  }

  if (rateOfChange > MODERATE_CHANGE_THRESHOLD) {
    return (
      <Badge size='3' style={{ backgroundColor: '#59ACFF', color: '#ffffff' }}>
        Growth Moderate Change (&gt;3 m)
      </Badge>
    )
  }

  if (rateOfChange > LOW_CHANGE_THRESHOLD) {
    return (
      <Badge size='3' style={{ backgroundColor: '#97DFFF', color: '#00448C' }}>
        Growth Low Change (&gt;2 m)
      </Badge>
    )
  }

  // Fallback for no significant change
  return (
    <Badge size='3' style={{ backgroundColor: '#8D8D8D', color: '#ffffff' }}>
      No Significant Change
    </Badge>
  )
}

export const HotSpotResultView = ({
  selectedCountryFeature,
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
      <Flex direction={isMobileWidth ? 'column' : 'row'} justify='between' align='center' gap='2'>
        <HotSpotBadge rateOfChange={rateOfChange} />
        <Flex direction={isMobileWidth ? 'column' : 'row'} gap='4' py={isMobileWidth ? '3' : '3'}>
          {selectedCountryFeature && (
            <TextButton ariaLabel='View Country Information' onClick={goToCountryView}>
              COUNTRY VIEW
            </TextButton>
          )}
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
