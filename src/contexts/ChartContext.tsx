import { createContext, useState } from 'react'
import type { ChartType, DateType } from '../library/types'
import { NONE_VALUE } from '../library/constants'

interface ChartContextType {
  startDate: string | null
  endDate: string | null
  selectedChartType: ChartType
  onDateChange: (dateType: DateType, value: string) => void
  onChartTypeChange: (type: ChartType) => void
  resetChartDefaultSettings: () => void
}

interface ChartProviderProps {
  children: React.ReactNode
}

export const ChartContext = createContext<ChartContextType | undefined>(undefined)

export const ChartProvider = ({ children }: ChartProviderProps) => {
  const [startDate, setStartDate] = useState<string | null>('1999')
  const [endDate, setEndDate] = useState<string | null>('2023')
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line')

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

  return (
    <ChartContext.Provider
      value={{
        startDate,
        endDate,
        selectedChartType,
        onDateChange,
        onChartTypeChange,
        resetChartDefaultSettings,
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}
