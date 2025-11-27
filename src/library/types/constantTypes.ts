// Country types
export type PacificCountry = {
  readonly id: string
  readonly name: string
}

export type CustomCountryBboxType = Record<
  PacificCountry['id'],
  [number, number, number, number] | null
>

// Responsive types
export type ResponsiveState = {
  isMobileWidth: boolean
}

export type RatesOfChangeYear = {
  readonly id: string
  readonly value: string
}

export type DateType = 'start' | 'end'

export type HotspotRadioState = 'high' | 'moderate' | 'low'

export type DateSelectType = 'custom' | 'between' | 'before' | 'after'

export type DateSelectOptions = {
  readonly id: string
  readonly label: string
  readonly value: DateSelectType
}

export type GlossaryTerms = {
  readonly term: string
  readonly definition: string
}
