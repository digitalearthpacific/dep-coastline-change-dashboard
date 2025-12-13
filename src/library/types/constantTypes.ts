// Icon types
export type IconType = {
  readonly color?: string
  readonly className?: string
}

// Country types
export type PacificCountry = {
  readonly id: string
  readonly name: string
}

// Responsive types
export type ResponsiveState = {
  isMobileWidth: boolean
  isSmallerDesktopWidth: boolean
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

export type TerminologyType = {
  readonly term: string
  readonly definition: string
}
