import { Card, Flex, Text } from '@radix-ui/themes'
import { useMapData } from '../../hooks/useGlobalContext'
import { CustomPopover } from '../CustomPopover'

export const ShorelineChangeCard = () => {
  const { selectedCountryFeature } = useMapData()
  const shorelineChangeDirection = selectedCountryFeature?.properties?.shoreline_change_direction

  return (
    <Card>
      <Flex direction='column' gap='3'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Shoreline Change
            </Text>
            <CustomPopover
              ariaLabel='Information about shoreline change'
              content={
                'The kilometers of shoreline within each country showing retreat, growth, or stability between the years 1999-2023.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            The average annual rate of shoreline change
          </Text>
        </Flex>
        <Flex direction='column'>
          <Flex
            align='center'
            gap='2'
            style={{ borderBottom: '1px solid var(--gray-6)', paddingBottom: 'var(--space-1)' }}
          >
            <Text size='4' weight='bold'>
              {Math.round(Number(shorelineChangeDirection?.retreat_km)).toLocaleString() ?? '-'} km
            </Text>
            <Text size='3' color='gray'>
              Retreat
            </Text>
          </Flex>
          <Flex
            align='center'
            gap='2'
            style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
          >
            <Text size='4' weight='bold'>
              {Math.round(Number(shorelineChangeDirection?.growth_km)).toLocaleString() ?? '-'} km
            </Text>
            <Text size='3' color='gray'>
              Growth
            </Text>
          </Flex>
          <Flex align='center' gap='2' style={{ paddingTop: 'var(--space-1)' }}>
            <Text size='4' weight='bold'>
              {Math.round(Number(shorelineChangeDirection?.stable_km)).toLocaleString() ?? '-'} km
            </Text>
            <Text size='3' color='gray'>
              Stable
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}
