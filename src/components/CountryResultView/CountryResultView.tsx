import useResponsive from '../../hooks/useResponsive'
import { Flex, Grid, Text } from '@radix-ui/themes'
import { ShorelineChangeCard } from '../ShoreLineChangeCard'
import { HotSpotsCard } from '../HotSpotsCard'
import { PopulationCard } from '../PopulationCard'
import { BuildingsCard } from '../BuildingsCard'
import { MangrovesCard } from '../MangrovesCard'
import { TextButton } from '../TextButton'
import type { ContiguousHotspotProperties } from '../../library/types'
import { useMapData } from '../../hooks/useGlobalContext'
import { DateRangeSelect } from '../DateRangeSelect/DateRangeSelect'

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
      <DateRangeSelect />
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard />
        <HotSpotsCard />
      </Grid>
      <Flex direction='column' gap='1' justify='between'>
        <Text as='div' size={isMobileWidth ? '4' : '5'} weight='bold'>
          Key Statistics
        </Text>
        <Text as='div' size={isMobileWidth ? '2' : '3'} color='gray'>
          These numbers show the population, buildings, and mangroves currently visible on the map.
          They update as you pan or zoom the map to provide insights into your selected location.
        </Text>
      </Flex>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard totalPopulation={totalPopulationFromHotspot} />
        <BuildingsCard numberOfBuildings={numberOfBuildingsFromHotspot} />
        <MangrovesCard mangroveArea={mangroveAreaFromHotspot} />
      </Grid>
    </>
  )
}
