export type FlyToLocation = {
  center: readonly [number, number]
  zoom?: number
  duration?: number
}

import type { StyleSpecification } from 'maplibre-gl'

export type MapViewState = {
  longitude: number
  latitude: number
  zoom: number
}

export type MapStyleType = 'satellite' | 'basic' | 'light' | 'dark'

// Type for basemap style URL - can be either a string URL or a MapLibre style specification
export type BaseMapStyleUrl = string | StyleSpecification
