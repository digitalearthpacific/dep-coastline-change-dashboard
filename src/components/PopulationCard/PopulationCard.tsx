import { Card, Flex, Text } from '@radix-ui/themes'
import { useCountry } from '../../hooks/useGlobalContext'
import { CustomPopover } from '../CustomPopover/CustomPopover'

export const PopulationCard = () => {
  const { selectedCountryFeature } = useCountry()
  const population = selectedCountryFeature?.properties?.population_in_hotspots ?? '-'

  return (
    <Card>
      <Flex direction='column' gap='5'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Population
            </Text>
            <CustomPopover
              ariaLabel='Information about population'
              content={
                'Population counts represent the estimated total population within all hotspots of the selected type within the county, or for the selected hotspot. Counts are based on the best available population data and vary by country.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated population in hot spot coastal areas
          </Text>
        </Flex>
        <Text as='div' size='8' weight='bold'>
          {population.toLocaleString()}
        </Text>
      </Flex>
    </Card>
  )
}
