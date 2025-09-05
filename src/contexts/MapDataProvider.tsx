import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ContiguousHotspotProperties, CountryGeoJSONFeature } from '../library/types'
import { getNameByCountryCode, normalize } from '../library/utils'
import { PACIFIC_COUNTRIES_NAMES } from '../library/constants'
import { MapDataContext } from './MapDataContext'

interface MapDataProviderProps {
  children: React.ReactNode
}

export const MapDataProvider = ({ children }: MapDataProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [countryApiData, setCountryApiData] = useState<CountryGeoJSONFeature[]>([])
  const [selectedCountryFeature, setSelectedCountryFeature] =
    useState<CountryGeoJSONFeature | null>(null)
  const [contiguousHotspotFeatures, setContiguousHotspotFeatures] = useState<
    ContiguousHotspotProperties[]
  >([])

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
    <MapDataContext.Provider
      value={{
        setCountryApiData,
        countryApiData,
        selectedCountryFeature,
        updateCountrySelectAndSearchParam,
        contiguousHotspotFeatures,
        setContiguousHotspotFeatures,
      }}
    >
      {children}
    </MapDataContext.Provider>
  )
}
