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

// Easing functions for different animation types
export const EASING_FUNCTIONS = {
  smoothstep: (t: number) => t * t * (3 - 2 * t),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
} as const

// FlyTo configuration presets
export const FLY_TO_PRESETS = {
  firstSelection: {
    essential: true,
    easing: EASING_FUNCTIONS.smoothstep,
    curve: 1.2,
    speed: 1.5,
    maxDuration: 4000,
  },
  subsequentSelection: {
    essential: true,
    easing: EASING_FUNCTIONS.easeInOutCubic,
    curve: 1.1,
    speed: 1.2,
    maxDuration: 3000,
  },
} as const
