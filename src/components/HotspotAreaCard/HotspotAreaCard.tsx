import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'
import { formatCount } from '../../library/utils/formatCount'

type HotspotAreaCardProps = {
  hotspotArea: number | null
}

const HOTSPOT_AREA_INFO =
  'The rate of change values were calculated by comparing shoreline positions along transects over all years of available data (maximally 1999-2023). Transects were evenly spaced at 30-meter intervals. Rate of change values were calculated via a linear regression between year (x) and median distances (y) among all transects within each hotspot.'

export const HotspotAreaCard = ({ hotspotArea }: HotspotAreaCardProps) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <header style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Hotspot Area
            </Text>
            <CustomPopover ariaLabel='Information about hotspot area' content={HOTSPOT_AREA_INFO} />
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
