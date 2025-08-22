import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover/CustomPopover'

export const BuildingsCard = ({ numberOfBuildings }: { numberOfBuildings: number | string }) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Buildings
            </Text>
            <CustomPopover
              ariaLabel='Information about buildings'
              content={
                'Buildings data were extracted from OpenStreetMap in August, 2025 and represent all building types.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated number of buildings in hot spot coastal areas
          </Text>
        </Flex>
        <Text as='div' size='8' weight='bold'>
          {numberOfBuildings.toLocaleString()}
        </Text>
      </Flex>
    </Card>
  )
}
