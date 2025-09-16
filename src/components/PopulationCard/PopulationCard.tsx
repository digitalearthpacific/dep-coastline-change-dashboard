import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'

type PopulationCardProps = {
  totalPopulation: number | null
}

const POPULATION_INFO =
  'Population counts represent the estimated total population within all hotspots of the selected type within the county, or for the selected hotspot. Counts are based on the best available population data and vary by country.'

const formatPopulation = (population: number | null): string => {
  if (population === null) return '—'
  if (population === 0) return 'n/a'

  return Math.round(Number(population)).toLocaleString()
}

export const PopulationCard = ({ totalPopulation }: PopulationCardProps) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <header style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Population
            </Text>
            <CustomPopover ariaLabel='Information about population' content={POPULATION_INFO} />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated population in hotspot coastal areas
          </Text>
        </header>

        <Text as='div' size='8' weight='bold'>
          {formatPopulation(totalPopulation)}
        </Text>
      </Flex>
    </Card>
  )
}
