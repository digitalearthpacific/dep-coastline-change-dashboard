import { useState, useCallback } from 'react'
import type { DateSelectType, DateType, HotspotRadioState } from '../library/types'
import { NONE_VALUE } from '../library/constants'
import { MapVisualizationContext } from './MapVisualizationContext'

const DEFAULT_START_DATE = '1999'
const DEFAULT_END_DATE = '2023'
const DEFAULT_SINGLE_DATE = '2023'

interface MapVisualizationProviderProps {
  children: React.ReactNode
}

export const MapVisualizationProvider = ({ children }: MapVisualizationProviderProps) => {
  const [startDate, setStartDate] = useState<string | null>(DEFAULT_START_DATE)
  const [endDate, setEndDate] = useState<string | null>(DEFAULT_END_DATE)
  const [singleDate, setSingleDate] = useState<string | null>(DEFAULT_SINGLE_DATE)
  const [hotspotRadio, setHotspotRadio] = useState<HotspotRadioState>('low')
  const [dateSelectType, setDateSelectType] = useState<DateSelectType>('between')

  const clearAllDates = useCallback(() => {
    setStartDate(null)
    setEndDate(null)
    setSingleDate(null)
  }, [])

  const resetToDefaultDates = useCallback(() => {
    setStartDate(DEFAULT_START_DATE)
    setEndDate(DEFAULT_END_DATE)
    setSingleDate(DEFAULT_SINGLE_DATE)
  }, [])

  const handleNoneValue = useCallback(
    (value: string, callback: () => void) => {
      if (value === NONE_VALUE) {
        clearAllDates()
        return
      }

      callback()
    },
    [clearAllDates],
  )

  const resetStartAndEndDate = useCallback(() => {
    setStartDate(DEFAULT_START_DATE)
    setEndDate(DEFAULT_END_DATE)
  }, [])

  const onSingleDateChange = useCallback(
    (value: string) => {
      handleNoneValue(value, () => setSingleDate(value))
    },
    [handleNoneValue],
  )

  const onDateChange = useCallback(
    (dateType: DateType, value: string) => {
      handleNoneValue(value, () => {
        if (dateType === 'start') {
          setStartDate(value)
        } else {
          setEndDate(value)
        }
      })
    },
    [handleNoneValue],
  )

  const onBeforeDateChange = useCallback(
    (value: string) => {
      handleNoneValue(value, () => {
        setStartDate(DEFAULT_START_DATE)
        setEndDate(value)
      })
    },
    [handleNoneValue],
  )

  const onAfterDateChange = useCallback(
    (value: string) => {
      handleNoneValue(value, () => {
        setStartDate(value)
        setEndDate(DEFAULT_END_DATE)
      })
    },
    [handleNoneValue],
  )

  const onDateSelectTypeChange = useCallback(
    (value: DateSelectType) => {
      resetToDefaultDates()
      setDateSelectType(value)
    },
    [resetToDefaultDates],
  )

  const onRadioStateChange = useCallback((value: HotspotRadioState) => {
    setHotspotRadio(value)
  }, [])

  return (
    <MapVisualizationContext.Provider
      value={{
        startDate,
        endDate,
        singleDate,
        onSingleDateChange,
        onDateChange,
        onBeforeDateChange,
        onAfterDateChange,
        resetStartAndEndDate,
        hotspotRadio,
        onRadioStateChange,
        dateSelectType,
        onDateSelectTypeChange,
      }}
    >
      {children}
    </MapVisualizationContext.Provider>
  )
}
