import { Badge, Card, Flex, Text } from '@radix-ui/themes'
import { useCountry } from '../../hooks/useGlobalContext'
import { CustomPopover } from '../CustomPopover/CustomPopover'

export const HotSpotsCard = () => {
  const { selectedCountryFeature } = useCountry()
  const shorelineChangeMagnitude = selectedCountryFeature?.properties?.shoreline_change_magnitude

  return (
    <Card>
      <Flex direction='column' gap='3'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Hotspots
            </Text>
            <CustomPopover
              ariaLabel='Information about coastal change hotspots'
              content={
                'The length of the total shoreline within the country experiencing either retreat or growth at various rates.'
              }
            />
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
              {shorelineChangeMagnitude?.high_change_km.toLocaleString() ?? '-'} km
            </Text>
            <Badge
              size='1'
              style={{ backgroundColor: 'var(--error-a3)', color: 'var(--error-a11)' }}
            >
              High Change (&gt;5m)
            </Badge>
          </Flex>
          <Flex
            justify='between'
            align='center'
            style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
          >
            <Text size='4' weight='bold'>
              {shorelineChangeMagnitude?.medium_change_km.toLocaleString() ?? '-'} km
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
              {shorelineChangeMagnitude?.low_change_km.toLocaleString() ?? '-'} km
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
}
