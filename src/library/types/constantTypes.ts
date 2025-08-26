// Country types
export type PacificCountry = {
  readonly id: string
  readonly name: string
}

// Responsive types
export type ResponsiveState = {
  isMobileWidth: boolean
}

export type RatesOfChangeYear = {
  readonly id: string
  readonly value: string
}

export type DateType = 'start' | 'end'

export type ChartType = 'bar' | 'line'
