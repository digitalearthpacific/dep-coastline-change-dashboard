import type { MapViewState } from '../types'
import StreetMapStyleThumbNail from '../../assets/street-thumbnail.png'
import SatelliteMapStyleThumbNail from '../../assets/satellite-thumbnail.png'
import LightMapStyleThumbNail from '../../assets/light-thumbnail.png'
import DarkMapStyleThumbNail from '../../assets/dark-thumbnail.png'
import type { ExpressionSpecification, FilterSpecification } from 'maplibre-gl'

const MAP_TILER_API_KEY = import.meta.env.COASTLINE_APP_MAP_TILER_API_KEY

// Map view state configuration
export const MAP_CONFIG = {
  INITIAL_VIEW_STATE: {
    longitude: 160,
    latitude: -10,
    zoom: 4,
  } as MapViewState,

  FLY_TO_ZOOM: {
    DESKTOP: 8,
    MOBILE: 6,
  },

  FLY_TO_DURATION: 2000,
} as const

// Easing functions for different animation types
export const EASING_FUNCTIONS = {
  smoothstep: (t: number) => t * t * (3 - 2 * t),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
} as const

// FlyTo configuration presets
export const FLY_TO_PRESETS = {
  firstSelection: {
    essential: true,
    easing: EASING_FUNCTIONS.smoothstep,
    curve: 1.2,
    speed: 1.5,
    maxDuration: 4000,
  },
  subsequentSelection: {
    essential: true,
    easing: EASING_FUNCTIONS.easeInOutCubic,
    curve: 1.1,
    speed: 1.2,
    maxDuration: 3000,
  },
} as const

export const BASE_MAPS = [
  {
    key: 'default',
    label: 'Default',
    thumbnail: StreetMapStyleThumbNail,
    styleUrl: `https://api.maptiler.com/maps/streets/style.json?key=${MAP_TILER_API_KEY}`,
  },
  {
    key: 'satellite',
    label: 'Satellite',
    thumbnail: SatelliteMapStyleThumbNail,
    styleUrl: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAP_TILER_API_KEY}`,
  },
  {
    key: 'light',
    label: 'Light',
    thumbnail: LightMapStyleThumbNail,
    styleUrl: `https://api.maptiler.com/maps/dataviz-light/style.json?key=${MAP_TILER_API_KEY}`,
  },
  {
    key: 'dark',
    label: 'Dark',
    thumbnail: DarkMapStyleThumbNail,
    styleUrl: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAP_TILER_API_KEY}`,
  },
] as const

export const MAP_LAYERS = {
  IDS: {
    BUILDINGS: 'Buildings',
    MANGROVES: 'Mangroves',
    SHORELINE_UNCERTAIN: 'Annual shorelines (uncertain)',
    SHORELINE_CERTAIN: 'Annual shorelines',
    SHORELINE_LABELS: 'Annual shorelines labels',
    HOTSPOT_FILL: 'hotspot-fill',
    HOTSPOT_OUTLINE: 'hotspot-outline',
  },

  SOURCES: {
    BUILDINGS: 'buildings',
    MANGROVES: 'mangroves',
    COASTLINES: 'coastlines',
    HOTSPOTS: 'contiguous_hotspots',
  },
} as const

export const LEGEND_ITEMS = [
  { key: 'high', label: '>5 m', text: 'High', extraStyleClass: 'highChange' },
  { key: 'moderate', label: '3.0-5 m', text: 'Moderate', extraStyleClass: 'moderateChange' },
  { key: 'low', label: '2.0-2.99 m', text: 'Low', extraStyleClass: 'lowChange' },
]

// Shoreline layer configuration
export const MAP_EXPRESSION_CONFIGS = {
  SHORELINE_FILTERS: {
    CERTAIN: ['==', ['get', 'certainty'], 'good'] as FilterSpecification,
    UNCERTAIN: ['!=', ['get', 'certainty'], 'good'] as FilterSpecification,
  },

  SHORELINE_COLOR_EXPRESSION: [
    'interpolate',
    ['linear'],
    ['get', 'year'],
    1999,
    '#000004',
    2003,
    '#2f0a5b',
    2007,
    '#801f6c',
    2012,
    '#d34743',
    2017,
    '#fb9d07',
    2023,
    '#fcffa4',
  ] as ExpressionSpecification,

  HOTSPOT_COLOR_EXPRESSION: [
    'case',
    // High > 5
    [
      '>',
      [
        'case',
        ['<', ['get', 'sig_time'], 0.01],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      5,
    ],
    'rgba(210, 0, 5, 0.44)',

    // Moderate 3–5
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], 0.01],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      3,
    ],
    'rgba(255, 179, 0, 0.76)',

    // Low 2–2.99
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], 0.01],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      2,
    ],
    'rgba(0, 146, 75, 0.64)',

    // fallback → transparent
    'rgba(0,0,0,0)',
  ] as ExpressionSpecification,

  HOTSPOT_OPACITY_EXPRESSION: [
    'case',
    // If none of the thresholds matched, opacity = 0
    [
      'any',
      [
        '>',
        [
          'case',
          ['<', ['get', 'sig_time'], 0.01],
          ['abs', ['get', 'rate_time']],
          ['get', 'rate_time'],
        ],
        5,
      ],
      [
        '>=',
        [
          'case',
          ['<', ['get', 'sig_time'], 0.01],
          ['abs', ['get', 'rate_time']],
          ['get', 'rate_time'],
        ],
        3,
      ],
      [
        '>=',
        [
          'case',
          ['<', ['get', 'sig_time'], 0.01],
          ['abs', ['get', 'rate_time']],
          ['get', 'rate_time'],
        ],
        2,
      ],
    ],
    0.7, // show normally if matched
    0, // hide otherwise
  ] as ExpressionSpecification,
} as const

export const LAYER_IDS = MAP_LAYERS.IDS
export const SOURCE_IDS = MAP_LAYERS.SOURCES
export const SHORELINE_FILTERS = MAP_EXPRESSION_CONFIGS.SHORELINE_FILTERS
export const SHORELINE_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.SHORELINE_COLOR_EXPRESSION
export const HOTSPOT_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.HOTSPOT_COLOR_EXPRESSION
export const HOTSPOT_OPACITY_EXPRESSION = MAP_EXPRESSION_CONFIGS.HOTSPOT_OPACITY_EXPRESSION
