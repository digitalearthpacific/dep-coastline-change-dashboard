import useResponsive from '../../hooks/useResponsive'
import { Badge, Flex, Grid, Text } from '@radix-ui/themes'
import { PopulationCard } from '../PopulationCard'
import { MangrovesCard } from '../MangrovesCard'
import { BuildingsCard } from '../BuildingsCard'
import { TextButton } from '../TextButton'
import type { ContiguousHotspotProperties } from '../../library/types'
import { HotspotAreaCard } from '../HotspotAreaCard/HotspotAreaCard'
import { RETREAT_VALUES, GROWTH_VALUES } from '../../library/constants'
import { BackButton } from '../BackButton'
import { ExportButton } from '../ExportButton'
import { LocationCard } from '../LocationCard'

type HotSpotResultViewProps = {
  selectedHotspotData: ContiguousHotspotProperties | null
  goToCountryView: () => void
  goToBackgroundInfoView: () => void
  goToGlossaryView: () => void
  goToUserGuideView: () => void
}

const HotSpotBadge = ({ rateOfChange }: { rateOfChange: number | null }) => {
  if (rateOfChange === null) return null

  // Exact value matching for retreats
  if (rateOfChange === RETREAT_VALUES.HIGH) {
    return (
      <Badge size='3' style={{ backgroundColor: '#CC5803', color: '#ffffff' }}>
        Retreat High Change (&gt;5 m per year)
      </Badge>
    )
  }

  if (rateOfChange === RETREAT_VALUES.MODERATE) {
    return (
      <Badge size='3' style={{ backgroundColor: '#FF9E1B', color: '#ffffff' }}>
        Retreat Moderate Change (&gt;3 m per year)
      </Badge>
    )
  }

  if (rateOfChange === RETREAT_VALUES.LOW) {
    return (
      <Badge size='3' style={{ backgroundColor: '#FFD27F', color: '#773404' }}>
        Retreat Low Change (&gt;2 m per year)
      </Badge>
    )
  }

  // Exact value matching for growth
  if (rateOfChange === GROWTH_VALUES.HIGH) {
    return (
      <Badge size='3' style={{ backgroundColor: '#007BFF', color: '#ffffff' }}>
        Growth High Change (&gt;5 m per year)
      </Badge>
    )
  }

  if (rateOfChange === GROWTH_VALUES.MODERATE) {
    return (
      <Badge size='3' style={{ backgroundColor: '#59ACFF', color: '#ffffff' }}>
        Growth Moderate Change (&gt;3 m per year)
      </Badge>
    )
  }

  if (rateOfChange === GROWTH_VALUES.LOW) {
    return (
      <Badge size='3' style={{ backgroundColor: '#97DFFF', color: '#00448C' }}>
        Growth Low Change (&gt;2 m per year)
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
  goToGlossaryView,
  goToUserGuideView,
}: HotSpotResultViewProps) => {
  const { isMobileWidth, isSmallerDesktopWidth } = useResponsive()
  const totalPopulation = selectedHotspotData?.total_population ?? null
  const numberOfBuildings = selectedHotspotData?.building_counts ?? null
  const mangroveArea = selectedHotspotData?.mangrove_area_ha ?? null
  const rateOfChange = selectedHotspotData?.rate_time ?? null
  const hotspotArea = selectedHotspotData?.area_ha ?? null

  return (
    <>
      <BackButton onClick={goToCountryView} />
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
      <Flex>
        <HotSpotBadge rateOfChange={rateOfChange} />
      </Flex>
      <Text as='div' size={isMobileWidth ? '2' : '3'} color='gray'>
        Hotspots are coastal areas experiencing high levels of change. The estimated population,
        buildings, and mangroves within the selected hotspot are shown below.
      </Text>
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
