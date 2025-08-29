import { createContext, useState } from 'react'
import type { ChartType, DateType, HotspotCheckboxState } from '../library/types'
import { NONE_VALUE } from '../library/constants'

interface MapVisualizationContextType {
  startDate: string | null
  endDate: string | null
  selectedChartType: ChartType
  onDateChange: (dateType: DateType, value: string) => void
  onChartTypeChange: (type: ChartType) => void
  resetChartDefaultSettings: () => void
  hotspotCheckbox: HotspotCheckboxState
  onCheckboxStateChange: (name: keyof HotspotCheckboxState) => void
}

interface MapVisualizationProviderProps {
  children: React.ReactNode
}

export const MapVisualizationContext = createContext<MapVisualizationContextType | undefined>(
  undefined,
)

export const MapVisualizationProvider = ({ children }: MapVisualizationProviderProps) => {
  const [startDate, setStartDate] = useState<string | null>('1999')
  const [endDate, setEndDate] = useState<string | null>('2023')
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line')
  const [hotspotCheckbox, setHotspotCheckbox] = useState<HotspotCheckboxState>({
    shorelineRetreat: true,
    shorelineGrowth: true,
    shorelineStable: true,
    hotspotsHigh: true,
    hotspotsModerate: true,
    hotspotsLow: true,
  })

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

  const onCheckboxStateChange = (name: keyof HotspotCheckboxState) => {
    setHotspotCheckbox((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }))
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
        hotspotCheckbox,
        onCheckboxStateChange,
      }}
    >
      {children}
    </MapVisualizationContext.Provider>
  )
}
