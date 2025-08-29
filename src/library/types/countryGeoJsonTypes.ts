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
  ISO_Ter1: string
  total_population: number
  building_counts: number
  mangrove_area_ha: number
  sig_time: number
  rate_time: number
  dist_1999: number
  dist_2000: number
  dist_2001: number
  dist_2002: number
  dist_2003: number
  dist_2004: number
  dist_2005: number
  dist_2006: number
  dist_2007: number
  dist_2008: number
  dist_2009: number
  dist_2010: number
  dist_2011: number
  dist_2012: number
  dist_2013: number
  dist_2014: number
  dist_2015: number
  dist_2016: number
  dist_2017: number
  dist_2018: number
  dist_2019: number
  dist_2020: number
  dist_2021: number
  dist_2022: number
  dist_2023: number
}
