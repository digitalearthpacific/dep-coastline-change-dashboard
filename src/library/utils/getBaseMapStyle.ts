import { BASE_MAPS } from '../constants'
import type { MapStyleType } from '../types'

export function getBaseMapStyle(baseMap: MapStyleType): string {
  const map = BASE_MAPS.find((bm) => bm.key === baseMap)
  return map?.styleUrl ?? BASE_MAPS[0].styleUrl
}
