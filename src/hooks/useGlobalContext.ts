import { useContext } from 'react'
import { CountryContext } from '../contexts/CountryContext'
import { ChartContext } from '../contexts/ChartContext'

export const useCountry = () => {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}

export const useChart = () => {
  const context = useContext(ChartContext)
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider')
  }
  return context
}
