import React, { createContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { normalize } from '../library/utils/normalize'
import { PACIFIC_COUNTRIES_NAMES } from '../library/constants'
import type { CountryGeoJSONFeature } from '../library/types/countryGeoJsonTypes'
import { getNameByCountryCode } from '../library/utils/getNameByCountryCode'

interface CountryContextType {
  countryApiData: CountryGeoJSONFeature[] | []
  setCountryApiData: React.Dispatch<React.SetStateAction<CountryGeoJSONFeature[]>>
  selectedCountryFeature: CountryGeoJSONFeature | null
  updateCountrySelectAndSearchParam: (country: CountryGeoJSONFeature | null) => void
}

export const CountryContext = createContext<CountryContextType | undefined>(undefined)

interface CountryProviderProps {
  children: React.ReactNode
}

export const CountryProvider = ({ children }: CountryProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [countryApiData, setCountryApiData] = useState<CountryGeoJSONFeature[]>([])
  const [selectedCountryFeature, setSelectedCountryFeature] =
    useState<CountryGeoJSONFeature | null>(null)

  useEffect(() => {
    const countryParam = searchParams.get('country')

    const findCountryIdByName = (query: string): string | null => {
      const normQuery = normalize(query)
      return (
        PACIFIC_COUNTRIES_NAMES.find((country) => normalize(country.name) === normQuery)?.id || null
      )
    }

    if (countryParam) {
      const countryId = findCountryIdByName(countryParam)

      if (countryId) {
        const countryMetadata = countryApiData.find(
          (country: CountryGeoJSONFeature) => country.properties.id === countryId,
        )

        setSelectedCountryFeature(countryMetadata ?? null)
      }
    }
  }, [searchParams, countryApiData])

  const updateCountrySelectAndSearchParam = (country: CountryGeoJSONFeature | null) => {
    setSelectedCountryFeature(country)

    if (country) {
      setSearchParams({ country: getNameByCountryCode(country) }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <CountryContext.Provider
      value={{
        setCountryApiData,
        countryApiData,
        selectedCountryFeature,
        updateCountrySelectAndSearchParam,
      }}
    >
      {children}
    </CountryContext.Provider>
  )
}
