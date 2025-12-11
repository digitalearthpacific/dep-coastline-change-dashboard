import { Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'
import { formatCount } from '../../library/utils/formatCount'
import commonStyles from '../../styles/common.module.scss'

type PopulationCardProps = {
  totalPopulation: number | null
}

const POPULATION_INFO =
  'Population counts represent the estimated total population within all hotspots of the selected type within the county, or for the selected hotspot. Counts are based on the best available population data and vary by country. The population data is raster based and densities are calculated over relatively large areas, so exact populations may be under or over-represented in the statistics.'

export const PopulationCard = ({ totalPopulation }: PopulationCardProps) => {
  return (
    <div className={commonStyles.appCard}>
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
          {formatCount(totalPopulation)}
        </Text>
      </Flex>
    </div>
  )
}
