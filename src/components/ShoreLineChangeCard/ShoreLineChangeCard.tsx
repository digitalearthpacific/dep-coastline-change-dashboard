import { Card, Flex, Grid, Text } from '@radix-ui/themes'
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
                'The percent of shorelines within each country showing retreat, growth, or stability between the years 1999-2023. For some countries fewer years of data were available. Only statistically significant trends are displayed for retreat and growth, so values do not sum to 100%. Values less than +/- 2km/year were considered stable.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            The average annual rate of shoreline change
          </Text>
        </Flex>
        <Flex direction='column'>
          <Grid
            columns='2'
            style={{
              borderBottom: '1px solid var(--gray-6)',
              paddingBottom: 'var(--space-1)',
              gridTemplateColumns: '1fr 2fr',
            }}
          >
            <Text size='4' weight='bold'>
              {shorelineChangeDirection?.retreat_km.toLocaleString() ?? '-'} km
            </Text>
            <Text size='3' color='gray'>
              Retreat
            </Text>
          </Grid>
          <Grid
            columns='2'
            style={{
              borderBottom: '1px solid var(--gray-6)',
              padding: 'var(--space-1) 0',
              gridTemplateColumns: '1fr 2fr',
            }}
          >
            <Text size='4' weight='bold'>
              {shorelineChangeDirection?.growth_km.toLocaleString() ?? '-'} km
            </Text>
            <Text size='3' color='gray'>
              Growth
            </Text>
          </Grid>
          <Grid
            columns='2'
            style={{
              paddingTop: 'var(--space-1)',
              gridTemplateColumns: '1fr 2fr',
            }}
          >
            <Text size='4' weight='bold'>
              {shorelineChangeDirection?.stable_km.toLocaleString() ?? '-'} km
            </Text>
            <Text size='3' color='gray'>
              Stable
            </Text>
          </Grid>
        </Flex>
      </Flex>
    </Card>
  )
}
