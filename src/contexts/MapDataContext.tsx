import React, { createContext } from 'react'
import type { ContiguousHotspotProperties, CountryGeoJSONFeature } from '../library/types'

interface MapDataContextType {
  countryApiData: CountryGeoJSONFeature[] | []
  setCountryApiData: React.Dispatch<React.SetStateAction<CountryGeoJSONFeature[]>>
  selectedCountryFeature: CountryGeoJSONFeature | null
  updateCountrySelectAndSearchParam: (country: CountryGeoJSONFeature | null) => void
  contiguousHotspotFeatures: ContiguousHotspotProperties[] | []
  setContiguousHotspotFeatures: React.Dispatch<React.SetStateAction<ContiguousHotspotProperties[]>>
}

export const MapDataContext = createContext<MapDataContextType | undefined>(undefined)
