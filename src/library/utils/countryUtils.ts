import { PACIFIC_COUNTRIES_NAMES } from '../constants'
import type { CountryGeoJSONFeature } from '../types'
import { normalize } from './normalize'

export function getNameByCountryCode(country: CountryGeoJSONFeature): string | '' {
  if (!country) return ''

  const foundCountry = PACIFIC_COUNTRIES_NAMES.find((c) => c.id === country.properties.id)
  return foundCountry ? foundCountry.name : ''
}

export function findCountryIdByName(query: string): string | null {
  const normQuery = normalize(query)
  return (
    PACIFIC_COUNTRIES_NAMES.find((country) => normalize(country.name) === normQuery)?.id || null
  )
}

export function findCountryCustomZoomByName(id: string): number | null {
  return PACIFIC_COUNTRIES_NAMES.find((country) => country?.id === id)?.customZoomLevel || null
}
