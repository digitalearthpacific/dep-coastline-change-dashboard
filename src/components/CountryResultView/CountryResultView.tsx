import useResponsive from '../../hooks/useResponsive'
import { Flex, Grid, Text, Button, DropdownMenu } from '@radix-ui/themes'
import { DownloadIcon } from '@radix-ui/react-icons'
import { HotSpotsCard } from '../HotSpotsCard'
import { PopulationCard } from '../PopulationCard'
import { BuildingsCard } from '../BuildingsCard'
import { MangrovesCard } from '../MangrovesCard'
import { TextButton } from '../TextButton'
import { useMapData } from '../../hooks/useGlobalContext'
import styles from './CountryResultView.module.scss'

type CountryResultViewProps = {
  goToBackgroundInfoView: () => void
  goToGlossaryView: () => void
}

export const CountryResultView = ({
  goToBackgroundInfoView,
  goToGlossaryView,
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

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Export as PDF')
  }

  const handleExportJPG = () => {
    // TODO: Implement JPG export functionality
    console.log('Export as JPG')
  }

  return (
    <>
      <Flex
        direction={isMobileWidth ? 'column-reverse' : 'row-reverse'}
        gap='4'
        py='3'
        align='center'
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant='soft' color='gray'>
              EXPORT RESULTS
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className={styles.exportMenu}>
            <DropdownMenu.Item className={styles.exportMenuItem} onClick={handleExportPDF}>
              PDF
              <DownloadIcon />
            </DropdownMenu.Item>
            <DropdownMenu.Item className={styles.exportMenuItem} onClick={handleExportJPG}>
              JPG
              <DownloadIcon />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <TextButton ariaLabel='View Glossary' onClick={goToGlossaryView}>
          GLOSSARY
        </TextButton>
        <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
          VIEW BACKGROUND INFORMATION
        </TextButton>
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
