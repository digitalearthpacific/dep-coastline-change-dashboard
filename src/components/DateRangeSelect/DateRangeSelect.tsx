import { useRef, useMemo, useCallback } from 'react'
import { Flex, Grid, Select, Text } from '@radix-ui/themes'
import type { RatesOfChangeYear } from '../../library/types'

import { useMapVisualization } from '../../hooks/useGlobalContext'
import { DATE_SELECT_OPTIONS, NONE_VALUE, RATES_OF_CHANGE_YEARS } from '../../library/constants'

// Common styles for select content
const SELECT_CONTENT_STYLE = { maxHeight: '170px', overflowY: 'auto' } as const

export const DateRangeSelect = () => {
  const {
    singleDate,
    startDate,
    endDate,
    onDateChange,
    onBeforeDateChange,
    onAfterDateChange,
    onSingleDateChange,
    dateSelectType,
    onDateSelectTypeChange,
  } = useMapVisualization()

  const refs = {
    singleDate: useRef<HTMLDivElement>(null),
    startDate: useRef<HTMLDivElement>(null),
    endDate: useRef<HTMLDivElement>(null),
    dateSelectType: useRef<HTMLDivElement>(null),
  }

  const dateOptions = useMemo(
    () => ({
      startDate: endDate
        ? RATES_OF_CHANGE_YEARS.filter((year) => year.value <= endDate)
        : RATES_OF_CHANGE_YEARS,
      endDate: startDate
        ? RATES_OF_CHANGE_YEARS.filter((year) => year.value >= startDate)
        : RATES_OF_CHANGE_YEARS,
    }),
    [startDate, endDate],
  )

  const renderSelectOptions = useCallback(
    (years: typeof RATES_OF_CHANGE_YEARS) => (
      <>
        <Select.Item key={NONE_VALUE} value={NONE_VALUE}>
          None
        </Select.Item>
        <Select.Separator />
        {years.map((year) => (
          <Select.Item key={year.id} value={year.id}>
            {year.value}
          </Select.Item>
        ))}
      </>
    ),
    [],
  )

  const renderSelect = useCallback(
    (
      value: string | null,
      onValueChange: (value: string) => void,
      placeholder: string,
      ref: React.RefObject<HTMLDivElement | null>,
      options: RatesOfChangeYear[],
    ) => (
      <Select.Root value={value || ''} onValueChange={onValueChange}>
        <Select.Trigger placeholder={placeholder} />
        <Select.Content position='popper' ref={ref} style={SELECT_CONTENT_STYLE}>
          {renderSelectOptions(options)}
        </Select.Content>
      </Select.Root>
    ),
    [renderSelectOptions],
  )

  // Date input renderer based on type
  const renderDateInput = useCallback(() => {
    switch (dateSelectType) {
      case 'single':
        return renderSelect(
          singleDate,
          onSingleDateChange,
          'Select Year',
          refs.singleDate,
          RATES_OF_CHANGE_YEARS,
        )

      case 'between':
        return (
          <Grid columns='2' gap='3'>
            {renderSelect(
              startDate,
              (value) => onDateChange('start', value),
              'Start Date',
              refs.startDate,
              dateOptions.startDate,
            )}
            {renderSelect(
              endDate,
              (value) => onDateChange('end', value),
              'End Date',
              refs.endDate,
              dateOptions.endDate,
            )}
          </Grid>
        )

      case 'before':
        return renderSelect(
          endDate,
          onBeforeDateChange,
          'End Date',
          refs.endDate,
          RATES_OF_CHANGE_YEARS,
        )

      case 'after':
        return renderSelect(
          startDate,
          onAfterDateChange,
          'Start Date',
          refs.startDate,
          RATES_OF_CHANGE_YEARS,
        )

      default:
        return null
    }
  }, [
    dateSelectType,
    singleDate,
    startDate,
    endDate,
    onSingleDateChange,
    onDateChange,
    onBeforeDateChange,
    onAfterDateChange,
    renderSelect,
    dateOptions,
    refs,
  ])

  return (
    <Flex direction='column' gap='2'>
      <Text as='div' size='2' weight='bold'>
        Select a date range to update coastlines on the map
      </Text>
      <Grid columns='1' gap='4'>
        <Flex direction='column' justify='between' gap='3'>
          <Select.Root value={dateSelectType} onValueChange={onDateSelectTypeChange}>
            <Select.Trigger placeholder='Date Select Type' />
            <Select.Content
              position='popper'
              ref={refs.dateSelectType}
              style={SELECT_CONTENT_STYLE}
            >
              {DATE_SELECT_OPTIONS.map((option) => (
                <Select.Item key={option.id} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          {renderDateInput()}
        </Flex>
      </Grid>
    </Flex>
  )
}
