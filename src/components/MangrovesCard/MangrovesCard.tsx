import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'
import { formatCount } from '../../library/utils/formatCount'

type MangrovesCardProps = {
  mangroveArea: number | null
}

const MANGROVES_INFO =
  'Mangrove areas were defined by Digital Earth Pacific Mangroves dataset. Values are the total area of mangroves which overlap with the given hotspot or hotspots.'

export const MangrovesCard = ({ mangroveArea }: MangrovesCardProps) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <header style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Mangroves
            </Text>
            <CustomPopover ariaLabel='Information about mangroves' content={MANGROVES_INFO} />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated hectares of mangroves in hotspot coastal areas
          </Text>
        </header>

        <Text as='div' size='8' weight='bold'>
          {formatCount(mangroveArea, 'ha')}
        </Text>
      </Flex>
    </Card>
  )
}
