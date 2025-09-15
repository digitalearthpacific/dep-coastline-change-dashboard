import { useRef } from 'react'
import { Flex, Grid, Select, Text } from '@radix-ui/themes'

import { useMapVisualization } from '../../hooks/useGlobalContext'
import { NONE_VALUE, RATES_OF_CHANGE_YEARS } from '../../library/constants'
import useResponsive from '../../hooks/useResponsive'

export const DateRangeSelect = () => {
  const { startDate, endDate, onDateChange } = useMapVisualization()
  const { isMobileWidth } = useResponsive()
  const startDateSelectRef = useRef<HTMLDivElement>(null)
  const endDateSelectRef = useRef<HTMLDivElement>(null)

  const startDateOptions = endDate
    ? RATES_OF_CHANGE_YEARS.filter((year) => year.value <= endDate)
    : RATES_OF_CHANGE_YEARS
  const endDateOptions = startDate
    ? RATES_OF_CHANGE_YEARS.filter((year) => year.value >= startDate)
    : RATES_OF_CHANGE_YEARS

  return (
    <Flex direction='column' gap='2'>
      <Text as='div' size='4' weight='bold'>
        Select a date range to update shorelines on the map
      </Text>
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <Flex justify='between' gap='3'>
          <Select.Root
            value={startDate || ''}
            onValueChange={(value) => onDateChange('start', value)}
          >
            <Select.Trigger placeholder='Start Date' style={{ flex: 1 }} />
            <Select.Content
              position='popper'
              ref={startDateSelectRef}
              style={{ maxHeight: '170px', overflowY: 'auto' }}
            >
              <Select.Item key={NONE_VALUE} value={NONE_VALUE}>
                None
              </Select.Item>
              <Select.Separator />
              {startDateOptions.map((year) => (
                <Select.Item key={year.id} value={year.value}>
                  {year.value}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root value={endDate || ''} onValueChange={(value) => onDateChange('end', value)}>
            <Select.Trigger placeholder='End Date' style={{ flex: 1 }} />
            <Select.Content
              position='popper'
              ref={endDateSelectRef}
              style={{ maxHeight: '170px', overflowY: 'auto' }}
            >
              <Select.Item key={NONE_VALUE} value={NONE_VALUE}>
                None
              </Select.Item>
              <Select.Separator />
              {endDateOptions.map((year) => (
                <Select.Item key={year.id} value={year.id}>
                  {year.value}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Grid>
    </Flex>
  )
}
