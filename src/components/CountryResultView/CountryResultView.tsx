import useResponsive from '../../hooks/useResponsive'
import { Flex, Grid } from '@radix-ui/themes'
import { ShorelineChangeCard } from '../ShoreLineChangeCard/ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard/HotSpotsCard'
import { PopulationCard } from '../PopulationCard/PopulationCard'
import { BuildingsCard } from '../BuildingsCard/BuildingsCard'
import { MangrovesCard } from '../MangrovesCard/MangrovesCard'
import { ChartCard } from '../ChartCard/ChartCard'
import TextButton from '../TextButton/TextButton'
import type { ContiguousHotspotProperties } from '../../library/types/countryGeoJsonTypes'
import { useCountry } from '../../hooks/useGlobalContext'

type CountryResultViewProps = {
  selectedHotspotData: ContiguousHotspotProperties | null
  goToHotSpotView: () => void
  goToBackgroundInfoView: () => void
}

export const CountryResultView = ({
  selectedHotspotData,
  goToHotSpotView,
  goToBackgroundInfoView,
}: CountryResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const { selectedCountryFeature } = useCountry()
  const totalPopulation = selectedCountryFeature?.properties?.population_in_hotspots ?? '-'
  const numberOfBuildings =
    selectedCountryFeature?.properties?.number_of_buildings_in_hotspots ?? '-'
  const mangroveArea = selectedCountryFeature?.properties?.mangrove_area_ha_in_hotspots ?? '-'

  return (
    <>
      <Flex direction={isMobileWidth ? 'column-reverse' : 'row-reverse'} gap='4' py='3'>
        <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
          VIEW BACKGROUND INFORMATION
        </TextButton>
        {selectedHotspotData && (
          <TextButton ariaLabel='View Hot Spot Information' onClick={goToHotSpotView}>
            HOT SPOT VIEW
          </TextButton>
        )}
      </Flex>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard />
        <HotSpotsCard />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard totalPopulation={totalPopulation} />
        <BuildingsCard numberOfBuildings={numberOfBuildings} />
        <MangrovesCard mangroveArea={mangroveArea} />
      </Grid>
      <ChartCard />
    </>
  )
}
