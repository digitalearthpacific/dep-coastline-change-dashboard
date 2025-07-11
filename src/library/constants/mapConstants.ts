import type { MapViewState } from '../types'

// Default map configuration constants
export const MAP_DEFAULTS = {
  INITIAL_VIEW_STATE: {
    longitude: 160,
    latitude: -10,
    zoom: 4,
  },
  FLY_TO_ZOOM: 8,
  FLY_TO_DURATION: 2000,
} as const

// Map view state configuration
export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 160,
  latitude: -10,
  zoom: 4,
} as const

// Map interaction constants
export const FLY_TO_ZOOM = 8
export const FLY_TO_DURATION = 2000
