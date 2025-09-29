import { Card, Flex, Text } from '@radix-ui/themes'
import { formatCount } from '../../library/utils/formatCount'

type HotspotAreaCardProps = {
  hotspotArea: number | null
}

export const HotspotAreaCard = ({ hotspotArea }: HotspotAreaCardProps) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <header style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Hotspot Area
            </Text>
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            The total area of the selected hotspot
          </Text>
        </header>

        <Text as='div' size='8' weight='bold'>
          {formatCount(hotspotArea, 'ha')}
        </Text>
      </Flex>
    </Card>
  )
}
