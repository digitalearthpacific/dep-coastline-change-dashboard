import type { ExpressionSpecification } from 'maplibre-gl'
import {
  BASE_MAPS,
  HOTSPOT_SELECTED_COLOR_EXPRESSION,
  HOTSPOT_SELECTED_COLOR_EXPRESSION_SIMPLE,
} from '../constants'
import type { MapStyleType } from '../types'

export function getBaseMapStyle(baseMap: MapStyleType): string {
  const map = BASE_MAPS.find((bm) => bm.key === baseMap)
  return map?.styleUrl ?? BASE_MAPS[0].styleUrl
}

export function getHotspotSelectedColorExpression(
  baseMap: MapStyleType,
): ExpressionSpecification | string {
  return baseMap === 'satellite' || baseMap === 'dark'
    ? HOTSPOT_SELECTED_COLOR_EXPRESSION_SIMPLE
    : HOTSPOT_SELECTED_COLOR_EXPRESSION
}
