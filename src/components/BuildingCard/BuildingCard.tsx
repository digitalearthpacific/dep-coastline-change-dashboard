import { Card, Flex, Text } from '@radix-ui/themes'
import type { MockCoastLineChangeData } from '../../library/types'
import InfoCircledIcon from '../../assets/info-circled.svg'

export const BuildingCard = ({
  buildings,
}: {
  buildings: MockCoastLineChangeData['buildings'] | null
}) => (
  <Card>
    <Flex direction='column' gap='5'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Buildings
          </Text>
          <img src={InfoCircledIcon} alt='Information Icon About Buildings' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          Estimated number of buildings in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        {buildings ? buildings.toLocaleString() : '-'}
      </Text>
    </Flex>
  </Card>
)
