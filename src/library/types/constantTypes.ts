// Country types
export type PacificCountry = {
  readonly id: string
  readonly name: string
  readonly coordinates: readonly [number, number]
}

export type CountryId = PacificCountry['id']
export type CountryName = PacificCountry['name']
export type CountryCoordinates = PacificCountry['coordinates']

// Responsive types
export interface ResponsiveState {
  isMobileWidth: boolean
}

export interface ResponsiveConfig {
  mobileWidthThreshold?: number
}
