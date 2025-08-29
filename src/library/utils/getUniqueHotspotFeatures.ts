import type { ContiguousHotspotProperties } from '../types/countryGeoJsonTypes'

export function getUniqueHotspotFeatures(
  features: ContiguousHotspotProperties[],
): ContiguousHotspotProperties[] {
  const uniqueIds = new Set<string | number>()
  const uniqueFeatures: ContiguousHotspotProperties[] = []

  for (const feature of features) {
    const id = feature['uid']

    // Only process features with valid, non-null IDs
    if (id != null && !uniqueIds.has(id)) {
      uniqueIds.add(id)
      uniqueFeatures.push(feature)
    }
  }

  return uniqueFeatures
}
