import type { MapViewState } from '../types'
import StreetMapStyleThumbNail from '../../assets/street-thumbnail.png'
import SatelliteMapStyleThumbNail from '../../assets/satellite-thumbnail.png'
import LightMapStyleThumbNail from '../../assets/light-thumbnail.png'
import DarkMapStyleThumbNail from '../../assets/dark-thumbnail.png'
import type { ExpressionSpecification, FilterSpecification } from 'maplibre-gl'

const MAP_TILER_API_KEY = import.meta.env.COASTLINE_APP_MAP_TILER_API_KEY
export const RETREAT_VALUES = {
  HIGH: -6,
  MODERATE: -4,
  LOW: -2.5,
} as const

export const GROWTH_VALUES = {
  HIGH: 6,
  MODERATE: 4,
  LOW: 2.5,
} as const

export const MAP_STYLE = { width: '100%', height: '100%' } as const

export const DEFAULT_BBOX = [
  [134, -27.9],
  [-128.2, 4.7],
] as [[number, number], [number, number]]

export const INITIAL_VIEW_STATE = {
  longitude: -177,
  latitude: -12,
  zoom: 4,
} as MapViewState

export const NAVIGATION_CONTROL_STYLE = {
  marginBottom: 'var(--navigation-control-margin-bottom)',
  marginRight: 'var(--navigation-control-margin-right)',
} as const

export const SCALE_CONTROL_STYLES = {
  DEFAULT: {
    marginLeft: 'var(--scale-control-margin-left)',
  },
  MINIMAL: {
    marginLeft: '10px',
  },
} as const

export const SELECT_CONTENT_STYLE = { maxHeight: '380px', overflowY: 'auto' } as const

export const getScaleControlStyle = (isHotspotLayerVisible: boolean) =>
  isHotspotLayerVisible ? SCALE_CONTROL_STYLES.DEFAULT : SCALE_CONTROL_STYLES.MINIMAL

export const FLY_TO_ZOOM = {
  DESKTOP: 8,
  MOBILE: 6,
} as const

// Map animation duration
export const FLY_TO_DURATION = 2000 as const

export const BASE_MAPS = [
  {
    key: 'satellite',
    label: 'Satellite',
    thumbnail: SatelliteMapStyleThumbNail,
    styleUrl: {
      version: 8,
      name: 'Esri World Imagery (MapServer)',
      sources: {
        esri_world_imagery: {
          type: 'raster',
          tiles: [
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community',
        },
        maptiler_labels: {
          type: 'vector',
          tiles: [`https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${MAP_TILER_API_KEY}`],
        },
      },
      layers: [
        {
          id: 'esri-world-imagery',
          type: 'raster',
          source: 'esri_world_imagery',
        },
        {
          id: 'place-labels',
          type: 'symbol',
          source: 'maptiler_labels',
          'source-layer': 'place',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Noto Sans Regular'],
            'text-size': 12,
            'text-anchor': 'center',
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 2,
          },
        },
      ],
    },
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
  {
    key: 'high-retreat',
    label: 'High',
    boldLabel: '>5 m',
    extraStyleClass: 'highRetreat',
  },
  {
    key: 'moderate-retreat',
    label: 'Moderate',
    boldLabel: '>3 m',
    extraStyleClass: 'moderateRetreat',
  },
  {
    key: 'low-retreat',
    label: 'Low',
    boldLabel: '>2 m',
    extraStyleClass: 'lowRetreat',
  },
  {
    key: 'high-growth',
    label: 'High',
    boldLabel: '>5 m',
    extraStyleClass: 'highGrowth',
  },
  {
    key: 'moderate-growth',
    label: 'Moderate',
    boldLabel: '>3 m',
    extraStyleClass: 'moderateGrowth',
  },
  {
    key: 'low-growth',
    label: 'Low',
    boldLabel: '>2 m',
    extraStyleClass: 'lowGrowth',
  },
  {
    key: 'high-density',
    label: 'High Density',
    extraStyleClass: 'highDensity',
  },
  {
    key: 'low-density',
    label: 'Low Density',
    extraStyleClass: 'lowDensity',
  },
  {
    key: 'buildings',
    label: 'Buildings',
    extraStyleClass: 'buildings',
  },
]

export const RETREAT_LEGEND_ITEMS = LEGEND_ITEMS.slice(0, 3)
export const GROWTH_LEGEND_ITEMS = LEGEND_ITEMS.slice(3, 6)
export const DENSITY_LEGEND_ITEMS = LEGEND_ITEMS.slice(6, 8)
export const BUILDINGS_LEGEND_ITEMS = LEGEND_ITEMS.slice(8, 9)

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

  HOTSPOT_FILL_COLOR_EXPRESSION: [
    'case',
    // Exact value matching for retreats
    ['==', ['get', 'rate_time'], RETREAT_VALUES.HIGH],
    'rgba(204, 88, 3, 0.3)', // High Retreat

    ['==', ['get', 'rate_time'], RETREAT_VALUES.MODERATE],
    'rgba(255, 158, 27, 0.3)', // Moderate Retreat

    ['==', ['get', 'rate_time'], RETREAT_VALUES.LOW],
    'rgba(255, 210, 127, 0.3)', // Low Retreat

    // Exact value matching for growth
    ['==', ['get', 'rate_time'], GROWTH_VALUES.HIGH],
    'rgba(0, 123, 255, 0.3)', // High Growth

    ['==', ['get', 'rate_time'], GROWTH_VALUES.MODERATE],
    'rgba(89, 172, 255, 0.3)', // Moderate Growth

    ['==', ['get', 'rate_time'], GROWTH_VALUES.LOW],
    'rgba(151, 223, 255, 0.3)', // Low Growth

    // fallback (for any other values like 0 or unexpected values)
    'rgba(141, 141, 141, 0.3)',
  ] as ExpressionSpecification,

  HOTSPOT_OUTLINE_COLOR_EXPRESSION_: [
    'case',
    // Exact value matching for retreats
    ['==', ['get', 'rate_time'], RETREAT_VALUES.HIGH],
    'rgba(204, 88, 3, 1)', // High Retreat

    ['==', ['get', 'rate_time'], RETREAT_VALUES.MODERATE],
    'rgba(255, 158, 27, 1)', // Moderate Retreat

    ['==', ['get', 'rate_time'], RETREAT_VALUES.LOW],
    'rgba(255, 210, 127, 1)', // Low Retreat

    // Exact value matching for growth
    ['==', ['get', 'rate_time'], GROWTH_VALUES.HIGH],
    'rgba(0, 123, 255, 1)', // High Growth

    ['==', ['get', 'rate_time'], GROWTH_VALUES.MODERATE],
    'rgba(89, 172, 255, 1)', // Moderate Growth

    ['==', ['get', 'rate_time'], GROWTH_VALUES.LOW],
    'rgba(151, 223, 255, 1)', // Low Growth

    // fallback (for any other values like 0 or unexpected values)
    'rgba(141, 141, 141, 1)',
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
export const HOTSPOT_FILL_COLOR_EXPRESSION = MAP_EXPRESSION_CONFIGS.HOTSPOT_FILL_COLOR_EXPRESSION
export const HOTSPOT_OUTLINE_COLOR_EXPRESSION =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_OUTLINE_COLOR_EXPRESSION_
export const HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_SELECTED_COLOR_EXPRESSION_LIGHT
export const HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK =
  MAP_EXPRESSION_CONFIGS.HOTSPOT_SELECTED_COLOR_EXPRESSION_DARK
