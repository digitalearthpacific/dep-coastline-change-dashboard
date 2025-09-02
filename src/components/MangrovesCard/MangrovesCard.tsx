import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'

type MangrovesCardProps = {
  mangroveArea: number | null
}

const MANGROVES_INFO =
  'Mangrove areas were defined by the Global Mangrove Watch dataset v3.0 for the year 2020. Values are the total area of mangroves which overlap with the given hotspot or hotspots.'

const formatMangroveArea = (area: number | null): string => {
  if (area === null) return '—'
  return `${Math.round(Number(area)).toLocaleString()} ha`
}

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
            Estimated square area of mangroves in hotspot coastal areas
          </Text>
        </header>

        <Text as='div' size='8' weight='bold'>
          {formatMangroveArea(mangroveArea)}
        </Text>
      </Flex>
    </Card>
  )
}
