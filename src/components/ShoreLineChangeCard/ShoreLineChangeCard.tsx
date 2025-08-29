import { Card, Checkbox, Flex, Text } from '@radix-ui/themes'
import { useMapVisualization, useMapData } from '../../hooks/useGlobalContext'
import { CustomPopover } from '../CustomPopover/CustomPopover'

import styles from './ShoreLineChangeCard.module.scss'

export const ShorelineChangeCard = () => {
  const { selectedCountryFeature } = useMapData()
  const { hotspotCheckbox, onCheckboxStateChange } = useMapVisualization()
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
          <Flex
            align='center'
            gap='2'
            style={{ borderBottom: '1px solid var(--gray-6)', paddingBottom: 'var(--space-1)' }}
          >
            <Checkbox
              size='2'
              variant='surface'
              className={styles.checkboxButton}
              checked={hotspotCheckbox.shorelineRetreat}
              onCheckedChange={() => onCheckboxStateChange('shorelineRetreat')}
            />
            <Text size='4' weight='bold' style={{ width: '80px' }}>
              {shorelineChangeDirection?.percent_retreat ?? '-'}%
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
            <Checkbox
              size='2'
              variant='surface'
              className={styles.checkboxButton}
              checked={hotspotCheckbox.shorelineGrowth}
              onCheckedChange={() => onCheckboxStateChange('shorelineGrowth')}
            />
            <Text size='4' weight='bold' style={{ width: '80px' }}>
              {shorelineChangeDirection?.percent_growth ?? '-'}%
            </Text>
            <Text size='3' color='gray'>
              Growth
            </Text>
          </Flex>
          <Flex align='center' gap='2' style={{ paddingTop: 'var(--space-1)' }}>
            <Checkbox
              size='2'
              variant='surface'
              className={styles.checkboxButton}
              checked={hotspotCheckbox.shorelineStable}
              onCheckedChange={() => onCheckboxStateChange('shorelineStable')}
            />
            <Text size='4' weight='bold' style={{ width: '80px' }}>
              {shorelineChangeDirection?.percent_stable ?? '-'}%
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
