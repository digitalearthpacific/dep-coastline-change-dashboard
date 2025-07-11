export type FlyToLocation = {
  center: readonly [number, number]
  zoom?: number
  duration?: number
}

export type MapViewState = {
  longitude: number
  latitude: number
  zoom: number
}
