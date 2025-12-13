import { Flex, Grid, Text } from '@radix-ui/themes'

import useResponsive from '../../hooks/useResponsive'
import { HotSpotsCard } from '../HotSpotsCard'
import { PopulationCard } from '../PopulationCard'
import { BuildingsCard } from '../BuildingsCard'
import { MangrovesCard } from '../MangrovesCard'
import { TextButton } from '../TextButton'
import { useMapData } from '../../hooks/useGlobalContext'
import { ExportButton } from '../ExportButton'
import { LocationCard } from '../LocationCard'

type CountryResultViewProps = {
  goToBackgroundInfoView: () => void
  goToGlossaryView: () => void
  goToUserGuideView: () => void
}

export const CountryResultView = ({
  goToBackgroundInfoView,
  goToGlossaryView,
  goToUserGuideView,
}: CountryResultViewProps) => {
  const { isMobileWidth, isSmallerDesktopWidth } = useResponsive()
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
      <LocationCard />
      <Flex
        direction={isSmallerDesktopWidth ? 'column-reverse' : 'row-reverse'}
        py='3'
        align={isSmallerDesktopWidth && !isMobileWidth ? 'end' : 'center'}
        justify='between'
        className='hide-on-export'
      >
        <ExportButton />
        <Flex
          gap={isSmallerDesktopWidth ? '1' : '4'}
          direction={isSmallerDesktopWidth ? 'column' : 'row'}
          align={isSmallerDesktopWidth && !isMobileWidth ? 'end' : 'center'}
        >
          <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
            VIEW BACKGROUND INFORMATION
          </TextButton>
          <TextButton ariaLabel='View User Guide' onClick={goToUserGuideView}>
            USER GUIDE
          </TextButton>
          <TextButton ariaLabel='View Glossary' onClick={goToGlossaryView}>
            GLOSSARY
          </TextButton>
        </Flex>
      </Flex>
      <Grid columns='1'>
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
