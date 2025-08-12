import { Card, Flex, Text } from '@radix-ui/themes'
import type { MockCoastLineChangeData } from '../../library/types'
import InfoCircledIcon from '../../assets/info-circled.svg'

export const PopulationCard = ({
  population,
}: {
  population: MockCoastLineChangeData['population'] | null
}) => (
  <Card>
    <Flex direction='column' gap='5'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Population
          </Text>
          <img src={InfoCircledIcon} alt='Information Icon About Population' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          Estimated population in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        {population ? population.toLocaleString() : '-'}
      </Text>
    </Flex>
  </Card>
)
