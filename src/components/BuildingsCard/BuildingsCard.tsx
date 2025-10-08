import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'
import { formatCount } from '../../library/utils/formatCount'

type BuildingsCardProps = {
  numberOfBuildings: number | null
}

const BUILDINGS_INFO =
  'Buildings data were extracted from OpenStreetMap in August, 2025 and represent all building types. The buildings dataset is not complete for all areas.'

export const BuildingsCard = ({ numberOfBuildings }: BuildingsCardProps) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <header style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Buildings
            </Text>
            <CustomPopover ariaLabel='Information about buildings' content={BUILDINGS_INFO} />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated number of buildings in hotspot coastal areas
          </Text>
        </header>

        <Text as='div' size='8' weight='bold'>
          {formatCount(numberOfBuildings)}
        </Text>
      </Flex>
    </Card>
  )
}
