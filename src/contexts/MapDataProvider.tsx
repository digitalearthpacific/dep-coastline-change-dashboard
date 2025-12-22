import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ContiguousHotspotProperties, CountryGeoJSONFeature } from '../library/types'
import { getNameByCountryCode, findCountryIdByName } from '../library/utils'
import { SEARCHBAR_INITIAL_VALUE } from '../library/constants'
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
    const countryParam = searchParams.get('country') || SEARCHBAR_INITIAL_VALUE

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
