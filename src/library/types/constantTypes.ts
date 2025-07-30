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
export type ResponsiveState = {
  isMobileWidth: boolean
}

export type RatesOfChangeYear = {
  readonly id: string
  readonly value: string
}
