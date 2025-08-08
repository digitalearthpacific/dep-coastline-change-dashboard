import { Badge, Card, Flex, Text } from '@radix-ui/themes'
import type { MockCoastLineChangeData } from '../../library/types'
import InfoCircledIcon from '../../assets/info-circled.svg'

export const HotSpotsCard = ({
  hotSpots,
}: {
  hotSpots: MockCoastLineChangeData['hotSpots'] | undefined
}) => (
  <Card>
    <Flex direction='column' gap='3'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Hot Spots
          </Text>
          <img src={InfoCircledIcon} alt='Information Icon About Hot Spots' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          Identifies coastal regions experiencing high levels of change
        </Text>
      </Flex>
      <Flex direction='column'>
        <Flex
          justify='between'
          align='center'
          style={{ borderBottom: '1px solid var(--gray-6)', paddingBottom: 'var(--space-1)' }}
        >
          <Text size='4' weight='bold'>
            {typeof hotSpots?.highChange === 'number' ? hotSpots.highChange.toLocaleString() : '-'}{' '}
            km
          </Text>
          <Badge size='1' style={{ backgroundColor: 'var(--error-a3)', color: 'var(--error-a11)' }}>
            High Change (&gt;5m)
          </Badge>
        </Flex>
        <Flex
          justify='between'
          align='center'
          style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
        >
          <Text size='4' weight='bold'>
            {typeof hotSpots?.moderateChange === 'number'
              ? hotSpots.moderateChange.toLocaleString()
              : '-'}{' '}
            km
          </Text>
          <Badge
            size='1'
            style={{ backgroundColor: 'var(--warning-a3)', color: 'var(--warning-a11)' }}
          >
            Moderate Change (3-5m)
          </Badge>
        </Flex>
        <Flex justify='between' align='center' style={{ paddingTop: 'var(--space-1)' }}>
          <Text size='4' weight='bold'>
            {typeof hotSpots?.lowChange === 'number' ? hotSpots.lowChange.toLocaleString() : '-'} km
          </Text>
          <Badge
            size='1'
            style={{
              backgroundColor: 'var(--success-a3)',
              color: 'var(--success-a11)',
            }}
          >
            Low Change (2-3m)
          </Badge>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)
