import { COUNTRY_DATA_URL } from '../constants'
import type { CountryGeoJSONFeature } from '../types/countryGeoJsonTypes'

function sanitizeGeoJSONResponse(responseText: string): string {
  return responseText.replace(/:\s*NaN/g, ': null')
}

export async function fetchCountryData(): Promise<CountryGeoJSONFeature[]> {
  try {
    const response = await fetch(COUNTRY_DATA_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch country data: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    const sanitizedText = sanitizeGeoJSONResponse(responseText)
    const data = JSON.parse(sanitizedText)

    return data?.features || []
  } catch (error) {
    console.error('Error fetching GeoJSON:', error)
    return []
  }
}
