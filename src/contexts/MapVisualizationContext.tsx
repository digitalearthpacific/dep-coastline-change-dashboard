import { createContext } from 'react'
import type { DateSelectType, DateType, HotspotRadioState } from '../library/types'

interface MapVisualizationContextType {
  startDate: string | null
  endDate: string | null
  customDates: string[]
  onToggleCustomDate: (value: string) => void
  onDateChange: (dateType: DateType, value: string) => void
  onBeforeDateChange: (value: string) => void
  onAfterDateChange: (value: string) => void
  resetStartAndEndDate: () => void
  hotspotRadio: HotspotRadioState
  onRadioStateChange: (value: HotspotRadioState) => void
  dateSelectType: DateSelectType
  onDateSelectTypeChange: (value: DateSelectType) => void
  hideCoastlines: boolean
  onHideCoastlinesChange: (value: boolean) => void
}

export const MapVisualizationContext = createContext<MapVisualizationContextType | undefined>(
  undefined,
)
