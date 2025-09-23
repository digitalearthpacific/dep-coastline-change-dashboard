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

export const BASE_MAP_LABEL_PATTERNS = [
  'label',
  'text',
  'place',
  'poi',
  'road-label',
  'water-label',
  'country-label',
  'state-label',
  'city-label',
  'settlement',
] as const

export const LEGEND_ITEMS = [
  { key: 'high-retreat', label: '>5 m', text: 'High', extraStyleClass: 'highRetreat' },
  {
    key: 'moderate-retreat',
    label: '>3 m',
    text: 'Moderate',
    extraStyleClass: 'moderateRetreat',
  },
  { key: 'low-retreat', label: '>2 m', text: 'Low', extraStyleClass: 'lowRetreat' },
  { key: 'high-growth', label: '>5 m', text: 'High', extraStyleClass: 'highGrowth' },
  { key: 'moderate-growth', label: '>3 m', text: 'Moderate', extraStyleClass: 'moderateGrowth' },
  { key: 'low-growth', label: '>2 m', text: 'Low', extraStyleClass: 'lowGrowth' },
]

export const RETREAT_LEGEND_ITEMS = LEGEND_ITEMS.slice(0, 3)
export const GROWTH_LEGEND_ITEMS = LEGEND_ITEMS.slice(3)

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
    // High Retreat < -5 - Dark Red
    ['<', ['get', 'rate_time'], -HIGH_CHANGE_THRESHOLD],
    'rgba(204, 88, 3, 0.7)',

    // Moderate Retreat < -3 (but >= -5) - Light Orange
    ['<', ['get', 'rate_time'], -MODERATE_CHANGE_THRESHOLD],
    'rgba(255, 158, 27, 0.7)',

    // Low Retreat < -2 (but >= -3) - Yellow
    ['<', ['get', 'rate_time'], -LOW_CHANGE_THRESHOLD],
    'rgba(255, 210, 127, 0.7)',

    // High Growth > 5 - Dark Blue
    ['>', ['get', 'rate_time'], HIGH_CHANGE_THRESHOLD],
    'rgba(0, 123, 255, 0.7)',

    // Moderate Growth > 3 (but <= 5) - Light Blue
    ['>', ['get', 'rate_time'], MODERATE_CHANGE_THRESHOLD],
    'rgba(89, 172, 255, 0.7)',

    // Low Growth > 2 (but <= 3) - Light Cyan
    ['>', ['get', 'rate_time'], LOW_CHANGE_THRESHOLD],
    'rgba(151, 223, 255, 0.7)',

    // fallback - Grey
    'rgba(141, 141, 141, 0.7)',
  ] as ExpressionSpecification,

  // Selected hotspot colors
  HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT: '#FFFFFF',
  HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK: '#000000',
} as const

export const LAYER_IDS = MAP_LAYERS.IDS
export const SOURCE_IDS = MAP_LAYERS.SOURCES
export const TILE_URLS = MAP_LAYERS.TILE_URLS
export const SHORELINE_FILTERS = MAP_EXPRESSION_CONFIGS.SHORELINE_FILTERS
export const SHORELINE_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.SHORELINE_COLOR_EXPRESSION
export const HOTSPOT_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.HOTSPOT_COLOR_EXPRESSION
export const HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT
export const HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK
