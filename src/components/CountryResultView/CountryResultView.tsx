import useResponsive from '../../hooks/useResponsive'
import { Flex, Grid } from '@radix-ui/themes'
import { ShorelineChangeCard } from '../ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard'
import { PopulationCard } from '../PopulationCard'
import { BuildingsCard } from '../BuildingsCard'
import { MangrovesCard } from '../MangrovesCard'
import { ChartCard } from '../ChartCard'
import { TextButton } from '../TextButton'
import type { ContiguousHotspotProperties } from '../../library/types/countryGeoJsonTypes'
import { useMapData } from '../../hooks/useGlobalContext'

type CountryResultViewProps = {
  selectedHotspotData: ContiguousHotspotProperties | null
  goToHotspotView: () => void
  goToBackgroundInfoView: () => void
}

export const CountryResultView = ({
  selectedHotspotData,
  goToHotspotView,
  goToBackgroundInfoView,
}: CountryResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const { contiguousHotspotFeatures } = useMapData()

  const totalPopulationFromHotspot = contiguousHotspotFeatures.reduce(
    (acc, feature) => acc + (feature.total_population ?? 0),
    0,
  )
  const numberOfBuildingsFromHotspot = contiguousHotspotFeatures.reduce(
    (acc, feature) => acc + (feature.building_counts ?? 0),
    0,
  )
  const mangroveAreaFromHotspot = contiguousHotspotFeatures.reduce(
    (acc, feature) => acc + (feature.mangrove_area_ha ?? 0),
    0,
  )

  return (
    <>
      <Flex direction={isMobileWidth ? 'column-reverse' : 'row-reverse'} gap='4' py='3'>
        <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
          VIEW BACKGROUND INFORMATION
        </TextButton>
        {selectedHotspotData && (
          <TextButton ariaLabel='View Hotspot Information' onClick={goToHotspotView}>
            HOTSPOT VIEW
          </TextButton>
        )}
      </Flex>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard />
        <HotSpotsCard />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard totalPopulation={totalPopulationFromHotspot} />
        <BuildingsCard numberOfBuildings={numberOfBuildingsFromHotspot} />
        <MangrovesCard mangroveArea={mangroveAreaFromHotspot} />
      </Grid>
      <ChartCard />
    </>
  )
}
