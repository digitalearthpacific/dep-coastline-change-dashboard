import { GROWTH_VALUES, RETREAT_VALUES } from '../constants'
import type { ContiguousHotspotProperties } from '../types'

export function applyHotspotRadioFilter(
  features: ContiguousHotspotProperties[],
  radioValue: string,
): ContiguousHotspotProperties[] {
  if (!radioValue) return []

  const filterMap: Record<string, (feature: ContiguousHotspotProperties) => boolean> = {
    high: (feature) =>
      feature.rate_time === GROWTH_VALUES.HIGH || feature.rate_time === RETREAT_VALUES.HIGH,

    moderate: (feature) =>
      feature.rate_time === GROWTH_VALUES.MODERATE || feature.rate_time === RETREAT_VALUES.MODERATE,

    low: (feature) =>
      feature.rate_time === GROWTH_VALUES.LOW || feature.rate_time === RETREAT_VALUES.LOW,
  }

  const filterFunction = filterMap[radioValue]
  return filterFunction ? features.filter(filterFunction) : []
}
