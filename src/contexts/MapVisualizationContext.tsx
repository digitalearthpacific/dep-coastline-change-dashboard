import { createContext } from 'react'
import type { DateType, HotspotRadioState } from '../library/types'

interface MapVisualizationContextType {
  startDate: string | null
  endDate: string | null
  onDateChange: (dateType: DateType, value: string) => void
  resetStartAndEndDate: () => void
  hotspotRadio: HotspotRadioState
  onRadioStateChange: (value: HotspotRadioState) => void
}

export const MapVisualizationContext = createContext<MapVisualizationContextType | undefined>(
  undefined,
)
