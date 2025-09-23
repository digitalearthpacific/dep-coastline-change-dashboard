import { useState } from 'react'
import type { ChartType, DateType, HotspotRadioState } from '../library/types'
import { NONE_VALUE } from '../library/constants'
import { MapVisualizationContext } from './MapVisualizationContext'

interface MapVisualizationProviderProps {
  children: React.ReactNode
}

export const MapVisualizationProvider = ({ children }: MapVisualizationProviderProps) => {
  const [startDate, setStartDate] = useState<string | null>('1999')
  const [endDate, setEndDate] = useState<string | null>('2023')
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line')
  const [hotspotRadio, setHotspotRadio] = useState<HotspotRadioState>('low')

  const resetChartDefaultSettings = () => {
    setStartDate('1999')
    setEndDate('2023')
    setSelectedChartType('line')
  }

  const onDateChange = (dateType: DateType, value: string) => {
    if (value === NONE_VALUE) {
      setStartDate(null)
      setEndDate(null)
      return
    }

    if (dateType === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const onChartTypeChange = (type: ChartType) => {
    setSelectedChartType(type)
  }

  const onRadioStateChange = (value: HotspotRadioState) => {
    setHotspotRadio(value)
  }

  return (
    <MapVisualizationContext.Provider
      value={{
        startDate,
        endDate,
        selectedChartType,
        onDateChange,
        onChartTypeChange,
        resetChartDefaultSettings,
        hotspotRadio,
        onRadioStateChange,
      }}
    >
      {children}
    </MapVisualizationContext.Provider>
  )
}
