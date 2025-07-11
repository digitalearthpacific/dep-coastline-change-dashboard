import type { PacificCountry } from './constantTypes'
import type { FlyToLocation } from './mapTypes'

// State management types
export type DashboardState = {
  selectedCountry: PacificCountry | null
  flyToLocation: FlyToLocation | null
}

// Component prop types
export type MainMapProps = {
  flyToLocation?: FlyToLocation | null
}

export type SearchBarProps = {
  selectedCountry?: PacificCountry | null
  onCountrySelect: (country: PacificCountry) => void
}
