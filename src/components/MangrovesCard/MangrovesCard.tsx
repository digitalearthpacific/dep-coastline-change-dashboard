import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover/CustomPopover'

export const MangrovesCard = ({ mangroveArea }: { mangroveArea: number | string }) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Mangroves
            </Text>
            <CustomPopover
              ariaLabel='Information about mangroves'
              content={
                'Mangrove areas were defined by the Global Mangrove Watch dataset v3.0 for the year 2020. Values are the total area of mangroves which overlap with the given hotspot or hotspots.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated square area of mangroves in hotspot coastal areas
          </Text>
        </Flex>
        <Text as='div' size='8' weight='bold'>
          {mangroveArea.toLocaleString()} ha
        </Text>
      </Flex>
    </Card>
  )
}
