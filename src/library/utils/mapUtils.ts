import type { ExpressionSpecification, Map as MapLibreMap, LayerSpecification } from 'maplibre-gl'
import {
  BASE_MAP_LABEL_PATTERNS,
  BASE_MAPS,
  HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT,
  HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK,
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
    ? HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT
    : HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK
}

// Helper function to find the first label layer ID in the current style
// Returns undefined for raster-based maps (satellite, Esri) which don't have separate label layers
// Returns the first label layer ID for vector-based maps to ensure proper layer ordering
export const findFirstLabelLayerId = (map: MapLibreMap): string | undefined => {
  // For satellite and Esri raster maps, there are no separate label layers
  // Returning undefined will add new layers at the top, which is the correct behavior
  // Check if this is an Esri raster map by style name
  const style = map.getStyle()
  const isEsriRasterMap = style.name?.includes('Esri') || style.name?.includes('esri')

  if (isEsriRasterMap) {
    return undefined
  }

  // For vector-based maps, find the first label layer for proper layer ordering
  const layers = map.getStyle().layers
  const labelLayer = layers.find((layer: LayerSpecification) =>
    BASE_MAP_LABEL_PATTERNS.some((pattern) => layer.id.toLowerCase().includes(pattern)),
  )?.id

  // Return the label layer ID if found, undefined otherwise
  // undefined means layers will be added at the top of the stack
  return labelLayer
}
