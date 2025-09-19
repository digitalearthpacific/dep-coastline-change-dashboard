import type { ExpressionSpecification, Map as MapLibreMap, LayerSpecification } from 'maplibre-gl'
import {
  BASE_MAP_LABEL_PATTERNS,
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

// Helper function to find the first label layer ID in the current style
export const findFirstLabelLayerId = (map: MapLibreMap): string | undefined => {
  const layers = map.getStyle().layers
  return layers.find((layer: LayerSpecification) =>
    BASE_MAP_LABEL_PATTERNS.some((pattern) => layer.id.toLowerCase().includes(pattern)),
  )?.id
}
