export interface MedianDistances {
  [year: string]: number
}

export interface ShorelineChangeDirection {
  percent_growth: number
  percent_growth_non_sig: number
  percent_retreat: number
  percent_retreat_non_sig: number
  percent_stable: number
}

export interface ShorelineChangeMagnitude {
  high_change_km: number
  low_change_km: number
  medium_change_km: number
}

export interface CountryGeoJSONFeature {
  type: 'Feature'
  properties: {
    id: string
    mangrove_area_ha_in_hotspots: number
    median_distances: MedianDistances
    number_of_buildings_in_hotspots: number
    population_in_hotspots: number
    shoreline_change_direction: ShorelineChangeDirection
    shoreline_change_magnitude: ShorelineChangeMagnitude
  }
  bbox: [number, number, number, number]
  geometry: {
    type: 'Point'
    coordinates: null | [number, number]
  }
}

export interface ContiguousHotspotProperties {
  uid: string
  total_population: number
  building_counts: number
  mangrove_area_ha: number
  rate_time: number
}
