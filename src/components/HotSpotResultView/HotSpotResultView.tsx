import useResponsive from '../../hooks/useResponsive'
import { Badge, Flex, Grid } from '@radix-ui/themes'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import { BuildingsCard } from '../BuildingsCard/BuildingsCard'
import TextButton from '../TextButton/TextButton'
import type {
  ContiguousHotspotProperties,
  CountryGeoJSONFeature,
} from '../../library/types/countryGeoJsonTypes'
import { RateOfChangeCard } from '../RateOfChangeCard/RateOfChangeCard'

type HotSpotResultViewProps = {
  selectedCountryFeature: CountryGeoJSONFeature | null
  selectedHotspotData: ContiguousHotspotProperties | null
  goToCountryView: () => void
  goToBackgroundInfoView: () => void
}

const HotSpotBadge = ({ hotspotIndicator }: { hotspotIndicator: number | undefined }) => {
  if (hotspotIndicator === undefined) return null

  const absoluteHotspotIndicator = Math.abs(hotspotIndicator)

  if (absoluteHotspotIndicator > 5) {
    return (
      <Badge size='3' style={{ backgroundColor: 'var(--error-a3)', color: 'var(--error-a11)' }}>
        High Change (&gt;5m)
      </Badge>
    )
  }

  if (absoluteHotspotIndicator >= 2.99 && absoluteHotspotIndicator <= 5) {
    return (
      <Badge size='3' style={{ backgroundColor: 'var(--warning-a3)', color: 'var(--warning-a11)' }}>
        Moderate Change (&gt;3m)
      </Badge>
    )
  }

  if (absoluteHotspotIndicator >= 2) {
    return (
      <Badge size='3' style={{ backgroundColor: 'var(--success-a3)', color: 'var(--success-a11)' }}>
        Low Change (&gt;1m)
      </Badge>
    )
  }

  return null
}

export const HotSpotResultView = ({
  selectedCountryFeature,
  selectedHotspotData,
  goToCountryView,
  goToBackgroundInfoView,
}: HotSpotResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const totalPopulation = selectedHotspotData?.total_population ?? '-'
  const numberOfBuildings = selectedHotspotData?.building_counts ?? '-'
  const mangroveArea = selectedHotspotData?.mangrove_area_ha ?? '-'
  const rateOfChange = selectedHotspotData?.rate_time ?? '-'
  const hotspotIndicator = Number(rateOfChange)

  return (
    <>
      <Flex direction={isMobileWidth ? 'column' : 'row'} justify='between' align='center' gap='2'>
        <HotSpotBadge hotspotIndicator={hotspotIndicator} />
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
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <RateOfChangeCard rateOfChange={rateOfChange} />
        <PopulationCard totalPopulation={totalPopulation} />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <BuildingsCard numberOfBuildings={numberOfBuildings} />
        <MangrovesCard mangroveArea={mangroveArea} />
      </Grid>
      <ChartCard />
    </>
  )
}
