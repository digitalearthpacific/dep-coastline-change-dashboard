import { createContext } from 'react'
import type { ChartType, DateType, HotspotRadioState } from '../library/types'

interface MapVisualizationContextType {
  startDate: string | null
  endDate: string | null
  selectedChartType: ChartType
  onDateChange: (dateType: DateType, value: string) => void
  onChartTypeChange: (type: ChartType) => void
  resetChartDefaultSettings: () => void
  hotspotRadio: HotspotRadioState
  onRadioStateChange: (value: HotspotRadioState) => void
}

export const MapVisualizationContext = createContext<MapVisualizationContextType | undefined>(
  undefined,
)
