import type { MapViewState } from '../types'

// Map view state configuration
export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 160,
  latitude: -10,
  zoom: 4,
} as const

// Map interaction constants
export const FLY_TO_DESKTOP_ZOOM = 8
export const FLY_TO_MOBILE_ZOOM = 6
export const FLY_TO_DURATION = 2000
