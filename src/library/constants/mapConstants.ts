import type { MapViewState } from '../types'
import StreetMapStyleThumbNail from '../../assets/street-thumbnail.png'
import SatelliteMapStyleThumbNail from '../../assets/satellite-thumbnail.png'
import LightMapStyleThumbNail from '../../assets/light-thumbnail.png'
import DarkMapStyleThumbNail from '../../assets/dark-thumbnail.png'
import type { ExpressionSpecification, FilterSpecification } from 'maplibre-gl'

const MAP_TILER_API_KEY = import.meta.env.COASTLINE_APP_MAP_TILER_API_KEY
export const SIGNIFICANCE_THRESHOLD = 0.01
export const HIGH_CHANGE_THRESHOLD = 5
export const MODERATE_CHANGE_THRESHOLD = 3
export const LOW_CHANGE_THRESHOLD = 2

export const MAP_CONFIG = {
  MAP_STYLE: { width: '100%', height: '100%' },
  INITIAL_VIEW_STATE: {
    longitude: 160,
    latitude: -10,
    zoom: 4,
  } as MapViewState,

  NAVIGATION_CONTROL_STYLE: {
    marginBottom: 'var(--navigation-control-margin-bottom, 106px)',
    marginRight: 'var(--navigation-control-margin-right, 24px)',
  },

  FLY_TO_ZOOM: {
    DESKTOP: 8,
    MOBILE: 6,
  },

  FLY_TO_DURATION: 2000,
} as const

export const EASING_FUNCTIONS = {
  smoothstep: (t: number) => t * t * (3 - 2 * t),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
} as const

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
    key: 'satellite',
    label: 'Satellite',
    thumbnail: SatelliteMapStyleThumbNail,
    styleUrl: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAP_TILER_API_KEY}`,
  },
  {
    key: 'basic',
    label: 'Basic',
    thumbnail: StreetMapStyleThumbNail,
    styleUrl: `https://api.maptiler.com/maps/streets/style.json?key=${MAP_TILER_API_KEY}`,
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

export const LEGEND_ITEMS = [
  { key: 'high', label: '>5 m', text: 'High', extraStyleClass: 'highChange' },
  { key: 'moderate', label: '3.0-5 m', text: 'Moderate', extraStyleClass: 'moderateChange' },
  { key: 'low', label: '2.0-2.99 m', text: 'Low', extraStyleClass: 'lowChange' },
]

export const MAP_LAYERS = {
  IDS: {
    BUILDINGS: 'Buildings',
    MANGROVES: 'Mangroves',
    SHORELINE_UNCERTAIN: 'shoreline-uncertain',
    SHORELINE_CERTAIN: 'shoreline-certain',
    SHORELINE_LABELS: 'shoreline-labels',
    HOTSPOT_FILL: 'hotspot-fill',
    HOTSPOT_OUTLINE: 'hotspot-outline',
  },

  SOURCES: {
    BUILDINGS: 'buildings',
    MANGROVES: 'mangroves',
    COASTLINES: 'coastlines',
    HOTSPOTS: 'contiguous_hotspots',
  },

  TILE_URLS: {
    BUILDINGS: 'https://tileserver.prod.digitalearthpacific.io/data/buildings/{z}/{x}/{y}.pbf',
    MANGROVES:
      'https://ows.prod.digitalearthpacific.io/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=mangroves&STYLES=style_mangroves_alt&FORMAT=image/png&TRANSPARENT=true&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}',
    COASTLINES: 'https://tileserver.prod.digitalearthpacific.io/data/coastlines/{z}/{x}/{y}.pbf',
    HOTSPOTS:
      'https://tileserver.prod.digitalearthpacific.io/data/dashboard-hotspot-stats/{z}/{x}/{y}.pbf',
  },
} as const

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
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      HIGH_CHANGE_THRESHOLD,
    ],
    'rgba(209, 0, 5, 0.7)',

    // Moderate 3–5
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      MODERATE_CHANGE_THRESHOLD,
    ],
    'rgba(255, 179, 0, 0.7)',

    // Low 2–2.99
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      LOW_CHANGE_THRESHOLD,
    ],
    'rgba(0, 134, 71, 0.7)',

    // fallback
    'rgba(141, 141, 141, 0.7)',
  ] as ExpressionSpecification,

  // Selected hotspot colors
  HOTSPOT_SELECTED_COLOR_EXPRESSION: [
    'case',
    // High > 5
    [
      '>',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      HIGH_CHANGE_THRESHOLD,
    ],
    'rgba(85, 0, 13, 0.9)',

    // Moderate 3–5
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      MODERATE_CHANGE_THRESHOLD,
    ],
    'rgba(52, 21, 0, 0.9)',

    // Low 2–2.99
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      LOW_CHANGE_THRESHOLD,
    ],
    'rgba(0, 38, 22, 0.9)',

    // fallback
    '#000000',
  ] as ExpressionSpecification,

  HOTSPOT_SELECTED_COLOR_EXPRESSION_SIMPLE: '#FFFFFF',

  // Add hotspot visibility filter
  HOTSPOT_VISIBILITY_FILTER: [
    'any',
    [
      '>',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      HIGH_CHANGE_THRESHOLD,
    ],
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      MODERATE_CHANGE_THRESHOLD,
    ],
    [
      '>=',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      LOW_CHANGE_THRESHOLD,
    ],
    [
      '<',
      [
        'case',
        ['<', ['get', 'sig_time'], SIGNIFICANCE_THRESHOLD],
        ['abs', ['get', 'rate_time']],
        ['get', 'rate_time'],
      ],
      LOW_CHANGE_THRESHOLD,
    ],
  ] as FilterSpecification,
} as const

export const LAYER_IDS = MAP_LAYERS.IDS
export const SOURCE_IDS = MAP_LAYERS.SOURCES
export const TILE_URLS = MAP_LAYERS.TILE_URLS
export const SHORELINE_FILTERS = MAP_EXPRESSION_CONFIGS.SHORELINE_FILTERS
export const SHORELINE_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.SHORELINE_COLOR_EXPRESSION
export const HOTSPOT_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.HOTSPOT_COLOR_EXPRESSION
export const HOTSPOT_SELECTED_COLOR_EXPRESSION =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_SELECTED_COLOR_EXPRESSION
export const HOTSPOT_SELECTED_COLOR_EXPRESSION_SIMPLE =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_SELECTED_COLOR_EXPRESSION_SIMPLE
export const HOTSPOT_VISIBILITY_FILTER = MAP_EXPRESSION_CONFIGS.HOTSPOT_VISIBILITY_FILTER
