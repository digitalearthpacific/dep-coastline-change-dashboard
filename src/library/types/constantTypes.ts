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

// Mock data generation for coastline change statistics, WILL REMOVE LATER
export type MockCoastLineChangeData = {
  shorelineChange?: {
    retreat?: number
    growth?: number
    stable?: number
  }
  hotSpots?: {
    highChange?: number
    moderateChange?: number
    lowChange?: number
  }
  population?: number
  buildings?: number
  mangroves?: number
}
