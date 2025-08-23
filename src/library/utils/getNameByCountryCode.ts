import { PACIFIC_COUNTRIES_NAMES } from '../constants'
import type { CountryGeoJSONFeature } from '../types/countryGeoJsonTypes'

export function getNameByCountryCode(country: CountryGeoJSONFeature): string | '' {
  if (!country) return ''

  const foundCountry = PACIFIC_COUNTRIES_NAMES.find((c) => c.id === country.properties.id)
  return foundCountry ? foundCountry.name : ''
}
