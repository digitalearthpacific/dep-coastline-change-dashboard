import { useRef, useMemo, useCallback } from 'react'
import { Flex, Grid, Select, Switch, Text, Popover, Checkbox, Badge } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import type { RatesOfChangeYear } from '../../library/types'
import styles from './DateRangePopup.module.scss'

import { useMapVisualization } from '../../hooks/useGlobalContext'
import {
  DATE_SELECT_OPTIONS,
  RATES_OF_CHANGE_YEARS,
  SELECT_CONTENT_STYLE,
} from '../../library/constants'

export const DateRangePopup = () => {
  const {
    customDates,
    startDate,
    endDate,
    onDateChange,
    onBeforeDateChange,
    onAfterDateChange,
    onToggleCustomDate,
    dateSelectType,
    onDateSelectTypeChange,
    hideCoastlines,
    onHideCoastlinesChange,
  } = useMapVisualization()

  // Stable refs (avoid recreating object each render to satisfy exhaustive-deps lint)
  const startDateRef = useRef<HTMLDivElement>(null)
  const endDateRef = useRef<HTMLDivElement>(null)
  const dateSelectTypeRef = useRef<HTMLDivElement>(null)

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
      case 'custom':
        return (
          <Popover.Root>
            <Popover.Trigger>
              <button type='button' className={styles.customTrigger}>
                <span className={styles.triggerText}>Select Years</span>
                <ChevronDownIcon />
              </button>
            </Popover.Trigger>
            <Popover.Content style={{ ...SELECT_CONTENT_STYLE, width: '220px' }}>
              <Flex direction='column'>
                {RATES_OF_CHANGE_YEARS.map((year) => {
                  const checked = customDates.includes(year.id)
                  return (
                    <Flex key={year.id} align='center' gap='2' px='1' py='2'>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggleCustomDate(year.id)}
                      />
                      <Text size='2'>{year.value}</Text>
                    </Flex>
                  )
                })}
              </Flex>
            </Popover.Content>
          </Popover.Root>
        )

      case 'between':
        return (
          <Grid columns='2' gap='3'>
            {renderSelect(
              startDate,
              (value) => onDateChange('start', value),
              'Start Date',
              startDateRef,
              dateOptions.startDate,
            )}
            {renderSelect(
              endDate,
              (value) => onDateChange('end', value),
              'End Date',
              endDateRef,
              dateOptions.endDate,
            )}
          </Grid>
        )

      case 'before':
        return renderSelect(
          endDate,
          onBeforeDateChange,
          'End Date',
          endDateRef,
          RATES_OF_CHANGE_YEARS,
        )

      case 'after':
        return renderSelect(
          startDate,
          onAfterDateChange,
          'Start Date',
          startDateRef,
          RATES_OF_CHANGE_YEARS,
        )

      default:
        return null
    }
  }, [
    dateSelectType,
    customDates,
    startDate,
    endDate,
    onToggleCustomDate,
    onDateChange,
    onBeforeDateChange,
    onAfterDateChange,
    renderSelect,
    dateOptions,
  ])

  return (
    <div className={styles.popupContainer}>
      <Flex gap='2' direction='column'>
        <Flex direction='column' gap='2'>
          <Text as='div' size='3' weight='bold'>
            Coastline Layers
          </Text>
          <Text as='div' size='2'>
            Changing the date updates which coastline layers are visible on the map. It does not
            modify or filter the underlying data.
          </Text>
          <Flex align='center' gap='2'>
            <Switch
              size='2'
              checked={hideCoastlines}
              onCheckedChange={onHideCoastlinesChange}
              style={{ boxShadow: 'none' }}
            />
            <Text as='div' size='2'>
              Hide Coastlines
            </Text>
          </Flex>
          <Grid columns='1' gap='4'>
            <Flex direction='column' justify='between' gap='3'>
              <Select.Root value={dateSelectType} onValueChange={onDateSelectTypeChange}>
                <Select.Trigger placeholder='Date Select Type' />
                <Select.Content
                  position='popper'
                  ref={dateSelectTypeRef}
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
              {dateSelectType === 'custom' && customDates.length > 0 && (
                <Flex className={styles.selectedYearsList}>
                  {[...customDates]
                    .sort()
                    .reverse()
                    .map((date) => (
                      <Badge color='gray' variant='soft' key={date} size='2'>
                        {date}
                      </Badge>
                    ))}
                </Flex>
              )}
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </div>
  )
}
