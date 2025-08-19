import { useContext } from 'react'
import { CountryContext } from '../contexts/CountryContext'

export const useCountry = () => {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}
