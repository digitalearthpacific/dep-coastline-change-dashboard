import { useState, useCallback } from 'react'
import type { DateSelectType, DateType, HotspotRadioState } from '../library/types'
import { MapVisualizationContext } from './MapVisualizationContext'

const DEFAULT_START_DATE = '1999'
const DEFAULT_END_DATE = '2023'

interface MapVisualizationProviderProps {
  children: React.ReactNode
}

export const MapVisualizationProvider = ({ children }: MapVisualizationProviderProps) => {
  const [startDate, setStartDate] = useState<string | null>(DEFAULT_START_DATE)
  const [endDate, setEndDate] = useState<string | null>(DEFAULT_END_DATE)
  const [customDates, setCustomDates] = useState<string[]>([])
  const [hotspotRadio, setHotspotRadio] = useState<HotspotRadioState>('low')
  const [dateSelectType, setDateSelectType] = useState<DateSelectType>('between')
  const [hideCoastlines, setHideCoastlines] = useState<boolean>(false)

  const resetToDefaultDates = useCallback(() => {
    setStartDate(DEFAULT_START_DATE)
    setEndDate(DEFAULT_END_DATE)
    setCustomDates([])
  }, [])

  const resetStartAndEndDate = useCallback(() => {
    setStartDate(DEFAULT_START_DATE)
    setEndDate(DEFAULT_END_DATE)
  }, [])

  const onToggleCustomDate = useCallback((value: string) => {
    setCustomDates((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }, [])

  const onDateChange = useCallback((dateType: DateType, value: string) => {
    if (dateType === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }, [])

  const onBeforeDateChange = useCallback((value: string) => {
    setStartDate(DEFAULT_START_DATE)
    setEndDate(value)
  }, [])

  const onAfterDateChange = useCallback((value: string) => {
    setStartDate(value)
    setEndDate(DEFAULT_END_DATE)
  }, [])

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

  const onHideCoastlinesChange = useCallback(() => {
    setHideCoastlines((prev) => !prev)
  }, [])

  return (
    <MapVisualizationContext.Provider
      value={{
        startDate,
        endDate,
        customDates,
        onToggleCustomDate,
        onDateChange,
        onBeforeDateChange,
        onAfterDateChange,
        resetStartAndEndDate,
        hotspotRadio,
        onRadioStateChange,
        dateSelectType,
        onDateSelectTypeChange,
        hideCoastlines,
        onHideCoastlinesChange,
      }}
    >
      {children}
    </MapVisualizationContext.Provider>
  )
}
