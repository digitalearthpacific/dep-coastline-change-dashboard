import React, { createContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PacificCountry } from '../library/types'
import { normalize } from '../library/utils/normalize'

interface CountryContextType {
  selectedCountry: PacificCountry | null
  setSelectedCountry: (country: PacificCountry | null) => void
}

export const CountryContext = createContext<CountryContextType | undefined>(undefined)

interface CountryProviderProps {
  children: React.ReactNode
  countries: PacificCountry[]
}

export const CountryProvider = ({ children, countries }: CountryProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCountry, setSelectedCountryState] = useState<PacificCountry | null>(null)

  useEffect(() => {
    const findCountryByName = (query: string): PacificCountry | null => {
      const normQuery = normalize(query)
      return countries.find((country) => normalize(country.name) === normQuery) || null
    }
    const countryParam = searchParams.get('country')

    if (countryParam) {
      const country = findCountryByName(countryParam)

      if (country) {
        setSelectedCountryState(country)
      } else {
        setSelectedCountryState(null)
        setSearchParams({}, { replace: true })
      }
    } else {
      setSelectedCountryState(null)
    }
  }, [searchParams, countries, setSearchParams])

  const setSelectedCountry = (country: PacificCountry | null) => {
    setSelectedCountryState(country)

    if (country) {
      // Use country name in URL, as typed by user
      setSearchParams({ country: country.name }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  )
}
