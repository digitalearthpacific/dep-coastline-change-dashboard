import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Map, { AttributionControl, NavigationControl, ScaleControl } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent, Map as MapLibreMap, MapGeoJSONFeature } from 'maplibre-gl'
import type { MapRef, MapMouseEvent } from 'react-map-gl/maplibre'
import type { FilterSpecification } from 'maplibre-gl'

import type { GeoJSONStoreFeatures } from 'terra-draw'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import booleanIntersects from '@turf/boolean-intersects'
import booleanWithin from '@turf/boolean-within'
import type { Feature, FeatureCollection, BBox, Polygon, MultiPolygon } from 'geojson'
import { IconButton, Tooltip } from '@radix-ui/themes'
import { Cross1Icon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MaplibreMeasureControl, MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw'
import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css'

import styles from './MainMap.module.scss'
import EnterFullScreenIcon from '../../assets/fullscreen.svg'
import ExitFullScreenIcon from '../../assets/fullscreen-exit.svg'
import { StraightenRoundedIcon } from '../../assets/StraightenRoundedIcon'
import { WaterRoundedIcon } from '../../assets/WaterRoundedIcon'
import { LayersIcon } from '../../assets/LayersIcon'

import {
  DEFAULT_BBOX,
  FLY_TO_DURATION,
  MAP_STYLE,
  INITIAL_VIEW_STATE,
  getScaleControlStyle,
  NAVIGATION_CONTROL_STYLE,
  LAYER_IDS,
  SOURCE_IDS,
  SHORELINE_FILTERS,
  SHORELINE_COLOR_EXPRESSION,
  HOTSPOT_FILL_COLOR_EXPRESSION,
  HOTSPOT_OUTLINE_COLOR_EXPRESSION,
  TILE_URLS,
  RETREAT_VALUES,
  GROWTH_VALUES,
  CUSTOM_COUNTRY_BBOXES,
} from '../../library/constants'
import type { MapStyleType } from '../../library/types'
import type { ContiguousHotspotProperties } from '../../library/types'
import useResponsive from '../../hooks/useResponsive'
import { useMapVisualization, useMapData } from '../../hooks/useGlobalContext'
import {
  getUniqueHotspotFeatures,
  getBaseMapStyle,
  getHotspotSelectedColorExpression,
  findFirstLabelLayerId,
  applyHotspotRadioFilter,
} from '../../library/utils'
import { BaseMapPopup } from '../BaseMapPopup'
import { DateRangePopup } from '../DateRangePopup'
import { MapLegend } from '../MapLegend'
import DrawIcon from '../../assets/DrawIcon'
import RefreshIcon from '../../assets/RefreshIcon'
import { MapDrawPopup } from '../MapDrawPopup'

type MainMapProps = {
  isFullscreen: boolean
  onFullscreenToggle: () => void
  onFullscreenExit: () => void
  selectedHotspotData: ContiguousHotspotProperties | null
  handleHotspotDataChange: (hotspotData: ContiguousHotspotProperties | null) => void
}

type TerraDrawFinishListener = (
  id: string | number,
  context: { mode: string; action: string },
) => void

type BoundingBox = [number, number, number, number]

const isValidBoundingBox = (bounds: BBox): bounds is BoundingBox =>
  Array.isArray(bounds) &&
  bounds.length === 4 &&
  bounds.every((value) => typeof value === 'number' && !Number.isNaN(value))

// Remove existing TerraDraw features so subsequent draws start with a clean slate
const removeTerraDrawFeatures = (
  terraDrawInstance: ReturnType<MaplibreTerradrawControl['getTerraDrawInstance']>,
) => {
  const existingIds = terraDrawInstance
    .getSnapshot()
    .map((feature) => feature.id)
    .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number')

  if (existingIds.length) {
    terraDrawInstance.removeFeatures(existingIds)
  }
}

export const MainMap = ({
  isFullscreen,
  onFullscreenToggle,
  onFullscreenExit,
  selectedHotspotData,
  handleHotspotDataChange,
}: MainMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const drawRef = useRef<MaplibreMeasureControl>(null)
  const polygonDrawRef = useRef<MaplibreTerradrawControl | null>(null)
  const polygonFinishHandlerRef = useRef<TerraDrawFinishListener | null>(null)
  const selectedHotspotDataRef = useRef(selectedHotspotData)
  const { isMobileWidth } = useResponsive()
  const { selectedCountryFeature, setContiguousHotspotFeatures } = useMapData()
  const { customDates, startDate, endDate, hotspotRadio, dateSelectType, hideCoastlines } =
    useMapVisualization()

  // State
  const [isDateRangePopupOpen, setIsDateRangePopupOpen] = useState(false)
  const [isBaseMapPopupOpen, setIsBaseMapPopupOpen] = useState(false)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [activeDrawMode, setActiveDrawMode] = useState<'polygon' | 'rectangle' | 'circle' | null>(
    null,
  )
  // Cache drawn polygon geometries outside TerraDraw's internal store
  const [polygonFeatures, setPolygonFeatures] = useState<GeoJSONStoreFeatures[]>([])
  // Derive a bounding box to constrain hotspot queries when custom geometry is present
  const polygonBoundingBox = useMemo<BoundingBox | null>(() => {
    if (!polygonFeatures.length) return null

    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: polygonFeatures as unknown as Feature[],
    }

    const bounds = bbox(collection) as BBox
    return isValidBoundingBox(bounds) ? bounds : null
  }, [polygonFeatures])
  const selectionPolygons = useMemo<Feature<Polygon | MultiPolygon>[]>(() => {
    return polygonFeatures
      .map((feature) => feature as unknown as Feature)
      .filter((feature): feature is Feature<Polygon | MultiPolygon> => {
        const type = feature.geometry?.type
        return type === 'Polygon' || type === 'MultiPolygon'
      })
  }, [polygonFeatures])
  const polygonBoundingBoxFeature = useMemo<Feature<Polygon> | null>(() => {
    if (!polygonBoundingBox) return null
    return bboxPolygon(polygonBoundingBox)
  }, [polygonBoundingBox])
  const [isMapDrawToolPopupOpen, setIsMapDrawToolPopupOpen] = useState(false)
  const [baseMap, setBaseMap] = useState<MapStyleType>('satellite')
  const [isBuildingsLayerVisible, setIsBuildingsLayerVisible] = useState(true)
  const [isMangrovesLayerVisible, setIsMangrovesLayerVisible] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLegendExpanded, setIsLegendExpanded] = useState(true)
  const [mapInitialViewBox, setMapInitialViewBox] = useState<
    [[number, number], [number, number]] | []
  >([])
  const baseMapRef = useRef(baseMap)

  // Computed values
  const isHotspotLayerVisible = Boolean(selectedCountryFeature)
  const navigationControlKey = `nav-control-${isMobileWidth ? 'mobile' : 'desktop'}`
  const scaleControlKey = `scale-control-${isMobileWidth ? 'mobile' : 'desktop'}`

  // Build dynamic filters for shoreline based on start and end date selections
  const createShorelineFilterExpression = useCallback(
    (certaintyCriteria?: FilterSpecification): FilterSpecification => {
      // If in custom mode with no selected years, return a filter that matches nothing
      if (dateSelectType === 'custom' && customDates.length === 0) {
        return ['==', ['get', 'year'], -1]
      }

      const filters: FilterSpecification[] = []

      if (certaintyCriteria) {
        filters.push(certaintyCriteria)
      }

      if (dateSelectType === 'custom' && customDates.length) {
        const years = customDates.map((y) => parseInt(y))
        const yearFilters: FilterSpecification[] = years.map((y) => ['==', ['get', 'year'], y])
        filters.push(['any', ...yearFilters] as FilterSpecification)
      }

      if (dateSelectType !== 'custom' && startDate && endDate) {
        filters.push(
          ['>=', ['get', 'year'], parseInt(startDate)],
          ['<=', ['get', 'year'], parseInt(endDate)],
        )
      }

      if (filters.length === 0) {
        return ['==', ['literal', true], true]
      }

      if (filters.length === 1) {
        return filters[0]
      }

      return ['all', ...filters] as FilterSpecification
    },
    [customDates, startDate, endDate, dateSelectType],
  )

  // Build dynamic filters for hotspots based on hotspot radio selection
  const createHotspotFilterExpression = useCallback((): FilterSpecification => {
    const filters: FilterSpecification[] = []

    if (hotspotRadio === 'high') {
      filters.push([
        'any',
        ['==', ['get', 'rate_time'], GROWTH_VALUES.HIGH],
        ['==', ['get', 'rate_time'], RETREAT_VALUES.HIGH],
      ])
    }

    if (hotspotRadio === 'moderate') {
      filters.push([
        'any',
        ['==', ['get', 'rate_time'], GROWTH_VALUES.MODERATE],
        ['==', ['get', 'rate_time'], RETREAT_VALUES.MODERATE],
      ])
    }

    if (hotspotRadio === 'low') {
      filters.push([
        'any',
        ['==', ['get', 'rate_time'], GROWTH_VALUES.LOW],
        ['==', ['get', 'rate_time'], RETREAT_VALUES.LOW],
      ])
    }

    const baseFilter = ['any', ...filters] as FilterSpecification

    if (!selectedCountryFeature?.properties?.id) {
      return baseFilter
    }

    return [
      'all',
      ['==', ['get', 'ISO_Ter1'], selectedCountryFeature?.properties?.id],
      baseFilter,
    ] as FilterSpecification
  }, [hotspotRadio, selectedCountryFeature?.properties?.id])

  // Bounding box for country fitting
  const createBoundingBox = useCallback(() => {
    if (!selectedCountryFeature?.bbox || !selectedCountryFeature.properties?.id) {
      return DEFAULT_BBOX
    }

    const countryId = selectedCountryFeature.properties.id

    // Use custom bbox if available, otherwise fall back to feature bbox
    const customBbox = CUSTOM_COUNTRY_BBOXES[countryId]
    const bbox = customBbox || selectedCountryFeature.bbox

    // Validate bbox format
    if (!Array.isArray(bbox) || bbox.length !== 4) {
      return DEFAULT_BBOX
    }

    const [minX, minY, maxX, maxY] = bbox

    return [
      [minX, minY],
      [maxX, maxY],
    ] as [[number, number], [number, number]]
  }, [selectedCountryFeature])

  // Layer management functions
  const addBuildingsLayer = useCallback(
    (map: MapLibreMap) => {
      const firstLabelLayerId = findFirstLabelLayerId(map)

      if (!map.getSource(SOURCE_IDS.BUILDINGS)) {
        map.addSource(SOURCE_IDS.BUILDINGS, {
          type: 'vector',
          tiles: [TILE_URLS.BUILDINGS],
          minzoom: 0,
          maxzoom: 13,
        })
      }

      if (!map.getLayer(LAYER_IDS.BUILDINGS)) {
        map.addLayer(
          {
            id: LAYER_IDS.BUILDINGS,
            type: 'fill',
            source: SOURCE_IDS.BUILDINGS,
            'source-layer': 'buildings',
            minzoom: 6,
            layout: { visibility: isBuildingsLayerVisible ? 'visible' : 'none' },
            paint: {
              'fill-color': '#A8B2B9',
              'fill-outline-color': '#4e4e4e',
              'fill-opacity': 0.8,
            },
          },
          firstLabelLayerId,
        )
      }
    },
    [isBuildingsLayerVisible],
  )

  const addMangrovesLayer = useCallback(
    (map: MapLibreMap) => {
      const firstLabelLayerId = findFirstLabelLayerId(map)

      if (!map.getSource(SOURCE_IDS.MANGROVES)) {
        map.addSource(SOURCE_IDS.MANGROVES, {
          type: 'raster',
          tiles: [TILE_URLS.MANGROVES],
          tileSize: 512,
        })
      }

      if (!map.getLayer(LAYER_IDS.MANGROVES)) {
        map.addLayer(
          {
            id: LAYER_IDS.MANGROVES,
            type: 'raster',
            source: SOURCE_IDS.MANGROVES,
            minzoom: 6,
            layout: { visibility: isMangrovesLayerVisible ? 'visible' : 'none' },
            paint: { 'raster-opacity': 0.6 },
          },
          firstLabelLayerId,
        )
      }
    },
    [isMangrovesLayerVisible],
  )

  const addShorelineChangeLayer = useCallback(
    (map: MapLibreMap) => {
      const firstLabelLayerId = findFirstLabelLayerId(map)

      if (!map.getSource(SOURCE_IDS.COASTLINES)) {
        map.addSource(SOURCE_IDS.COASTLINES, {
          type: 'vector',
          tiles: [TILE_URLS.COASTLINES],
          minzoom: 0,
          maxzoom: 13,
        })
      }

      const shorelineLayers = [
        {
          id: LAYER_IDS.SHORELINE_UNCERTAIN,
          filter: createShorelineFilterExpression(SHORELINE_FILTERS.UNCERTAIN),
          paint: {
            'line-color': SHORELINE_COLOR_EXPRESSION,
            'line-width': 2,
            'line-opacity': 0.8,
            'line-dasharray': [4, 4],
          },
        },
        {
          id: LAYER_IDS.SHORELINE_CERTAIN,
          filter: createShorelineFilterExpression(SHORELINE_FILTERS.CERTAIN),
          paint: {
            'line-color': SHORELINE_COLOR_EXPRESSION,
            'line-width': 2.5,
            'line-opacity': 1,
          },
        },
      ]

      shorelineLayers.forEach(({ id, filter, paint }) => {
        if (!map.getLayer(id)) {
          map.addLayer(
            {
              id,
              type: 'line',
              source: SOURCE_IDS.COASTLINES,
              'source-layer': 'shorelines_annual',
              minzoom: 13,
              maxzoom: 22,
              filter,
              layout: { visibility: hideCoastlines ? 'none' : 'visible' },
              paint,
            },
            firstLabelLayerId,
          )
        }
      })

      if (!map.getLayer(LAYER_IDS.SHORELINE_LABELS)) {
        map.addLayer({
          id: LAYER_IDS.SHORELINE_LABELS,
          type: 'symbol',
          source: SOURCE_IDS.COASTLINES,
          'source-layer': 'shorelines_annual',
          minzoom: 13,
          maxzoom: 22,
          layout: {
            'text-field': '{year}',
            'symbol-placement': 'line',
            'text-size': 12,
            visibility: hideCoastlines ? 'none' : 'visible',
          },
          paint: {
            'text-color': 'white',
            'text-halo-color': '#444444',
            'text-halo-width': 2,
          },
        })
      }
    },
    [createShorelineFilterExpression, hideCoastlines],
  )

  const addContiguousHotspot = useCallback(
    (map: MapLibreMap, overrideBaseMap?: MapStyleType) => {
      const firstLabelLayerId = findFirstLabelLayerId(map)
      const baseMapForExpression = overrideBaseMap || baseMapRef.current
      const hotspotSelectedColorExpression = getHotspotSelectedColorExpression(baseMapForExpression)

      if (!map.getSource(SOURCE_IDS.HOTSPOTS)) {
        map.addSource(SOURCE_IDS.HOTSPOTS, {
          type: 'vector',
          tiles: [TILE_URLS.HOTSPOTS],
          minzoom: 0,
          maxzoom: 13,
        })
      }

      if (!map.getLayer(LAYER_IDS.HOTSPOT_FILL)) {
        map.addLayer(
          {
            id: LAYER_IDS.HOTSPOT_FILL,
            type: 'fill',
            source: SOURCE_IDS.HOTSPOTS,
            'source-layer': 'contiguous_hotspots',
            minzoom: 3,
            layout: { visibility: isHotspotLayerVisible ? 'visible' : 'none' },
            filter: createHotspotFilterExpression(),
            paint: {
              'fill-color': HOTSPOT_FILL_COLOR_EXPRESSION,
            },
          },
          firstLabelLayerId,
        )
      }

      if (!map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
        map.addLayer(
          {
            id: LAYER_IDS.HOTSPOT_OUTLINE,
            type: 'line',
            source: SOURCE_IDS.HOTSPOTS,
            'source-layer': 'contiguous_hotspots',
            minzoom: 3,
            layout: { visibility: isHotspotLayerVisible ? 'visible' : 'none' },
            filter: createHotspotFilterExpression(),
            paint: {
              'line-color': [
                'case',
                ['==', ['get', 'uid'], selectedHotspotData?.uid || ''],
                hotspotSelectedColorExpression,
                HOTSPOT_OUTLINE_COLOR_EXPRESSION,
              ],
              'line-width': 2,
            },
          },
          firstLabelLayerId,
        )
      }
    },
    [selectedHotspotData, isHotspotLayerVisible, createHotspotFilterExpression],
  )

  // Event handlers
  const handleMapLoad = useCallback(() => {
    // Remove native tooltips
    requestAnimationFrame(() => {
      const controls = mapRef.current
        ?.getContainer()
        .querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out')
      controls?.forEach((control) => control.removeAttribute('title'))
    })

    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }

    // Add all layers
    addBuildingsLayer(map)
    addMangrovesLayer(map)
    addContiguousHotspot(map)
    addShorelineChangeLayer(map)

    // Add terradraw for different polygon drawing tools
    const polygonDrawControl = new MaplibreTerradrawControl({
      modes: ['polygon', 'rectangle', 'circle', 'render', 'select', 'delete', 'delete-selection'],
      open: false,
      adapterOptions: { prefixId: 'polygon-draw' },
    })
    map.addControl(polygonDrawControl, 'bottom-right')
    polygonDrawRef.current = polygonDrawControl

    const polygonTerraDraw = polygonDrawControl.getTerraDrawInstance()
    const finishHandler: TerraDrawFinishListener = () => {
      const terraDraw = polygonDrawControl.getTerraDrawInstance()
      setPolygonFeatures(terraDraw.getSnapshot())
      setActiveDrawMode(null)
      terraDraw.setMode('render')
    }
    polygonTerraDraw.on('finish', finishHandler)
    polygonFinishHandlerRef.current = finishHandler

    // Add terradraw for measure tools
    const draw = new MaplibreMeasureControl({
      modes: ['linestring'],
      open: false,
      measureUnitType: 'metric',
      distancePrecision: 2,
      forceDistanceUnit: 'auto',
      areaPrecision: 2,
      forceAreaUnit: 'auto',
      computeElevation: true,
      adapterOptions: { prefixId: 'measure-draw' },
    })
    map.addControl(draw, 'bottom-right')
    drawRef.current = draw

    // Add class to the control group containing the measure button to target margins
    requestAnimationFrame(() => {
      const measureBtn = mapRef.current
        ?.getContainer()
        .querySelector('.maplibregl-terradraw-measure-add-linestring-button')
      const group = measureBtn?.closest(
        '.maplibregl-ctrl.maplibregl-ctrl-group',
      ) as HTMLElement | null
      if (group) {
        group.classList.add('measure-control-group')
        group.style.margin = '0'
      }

      const polygonGroup = mapRef.current
        ?.getContainer()
        .querySelector('.maplibregl-terradraw-add-control')
        ?.closest('.maplibregl-ctrl') as HTMLElement | null
      if (polygonGroup) {
        polygonGroup.style.display = 'none'
      }
    })

    // Setup hotspot interactions
    const handleHotspotClick = (e: MapLayerMouseEvent) => {
      if (e.features?.[0]) {
        const featureProperties = e.features[0].properties as ContiguousHotspotProperties

        if (selectedHotspotDataRef.current?.uid === featureProperties.uid) {
          handleHotspotDataChange(null)
        } else {
          handleHotspotDataChange(featureProperties)
        }
      }
    }

    const handleMapClick = (e: MapMouseEvent) => {
      const hotspotFeatures = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_IDS.HOTSPOT_FILL, LAYER_IDS.HOTSPOT_OUTLINE],
      })

      if (!hotspotFeatures?.length) {
        handleHotspotDataChange(null)
      }
    }

    map.on('click', LAYER_IDS.HOTSPOT_FILL, handleHotspotClick)
    map.on('click', LAYER_IDS.HOTSPOT_OUTLINE, handleHotspotClick)
    map.on('click', handleMapClick)

    map.on('mouseenter', LAYER_IDS.HOTSPOT_FILL, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', LAYER_IDS.HOTSPOT_FILL, () => {
      map.getCanvas().style.cursor = ''
    })

    setIsMapLoaded(true)
  }, [
    addShorelineChangeLayer,
    addBuildingsLayer,
    addMangrovesLayer,
    addContiguousHotspot,
    handleHotspotDataChange,
    setPolygonFeatures,
  ])

  const handleBaseMapSelection = useCallback(
    (baseMapKey: MapStyleType) => {
      setBaseMap(baseMapKey)
      setIsBaseMapPopupOpen(false)

      // Clear polygon state immediately
      setPolygonFeatures([])
      setActiveDrawMode(null)

      // Clear measure tool state immediately
      setIsMeasuring(false)

      const map = mapRef.current?.getMap()
      if (map) {
        map.once('styledata', () => {
          // Re-add all layers first
          addBuildingsLayer(map)
          addMangrovesLayer(map)
          addShorelineChangeLayer(map)
          addContiguousHotspot(map, baseMapKey)

          // Then clean up TerraDraw after layers are restored
          const polygonControl = polygonDrawRef.current
          if (polygonControl) {
            try {
              const terraDrawInstance = polygonControl.getTerraDrawInstance()
              if (terraDrawInstance) {
                removeTerraDrawFeatures(terraDrawInstance)
                terraDrawInstance.setMode('render')
                polygonControl.resetActiveMode()
                polygonControl.deactivate()
              }
            } catch (error) {
              console.warn('Error cleaning up TerraDraw features after style load:', error)
            }
          }

          // Clean up measure tool after layers are restored
          const measureControl = drawRef.current
          if (measureControl) {
            try {
              const measureTerraDrawInstance = measureControl.getTerraDrawInstance()
              if (measureTerraDrawInstance) {
                // Remove measure features to clear labels
                const featureIds = measureTerraDrawInstance
                  .getSnapshot()
                  .map((f) => f.id)
                  .filter(
                    (id): id is string | number => typeof id === 'string' || typeof id === 'number',
                  )
                measureTerraDrawInstance.removeFeatures(featureIds)

                measureControl.resetActiveMode()
                measureControl.deactivate()
              }
            } catch (error) {
              console.warn('Error cleaning up measure tool features after style load:', error)
            }
          }
        })
      }
    },
    [
      addBuildingsLayer,
      addMangrovesLayer,
      addShorelineChangeLayer,
      addContiguousHotspot,
      setPolygonFeatures,
      setActiveDrawMode,
      setIsMeasuring,
    ],
  )

  const toggleLayerVisibility = useCallback((layerId: string, newVisibility: boolean) => {
    const map = mapRef.current?.getMap()
    if (map) {
      map.setLayoutProperty(layerId, 'visibility', newVisibility ? 'visible' : 'none')
    }
  }, [])

  const handleBuildingToggle = useCallback(() => {
    const newVisibility = !isBuildingsLayerVisible
    setIsBuildingsLayerVisible(newVisibility)
    toggleLayerVisibility(LAYER_IDS.BUILDINGS, newVisibility)
  }, [isBuildingsLayerVisible, toggleLayerVisibility])

  const handleMangroveToggle = useCallback(() => {
    const newVisibility = !isMangrovesLayerVisible
    setIsMangrovesLayerVisible(newVisibility)
    toggleLayerVisibility(LAYER_IDS.MANGROVES, newVisibility)
  }, [isMangrovesLayerVisible, toggleLayerVisibility])

  const handleBaseMapPopupToggle = useCallback(() => {
    setIsBaseMapPopupOpen((prev) => !prev)
    setIsDateRangePopupOpen(false)
    setIsMapDrawToolPopupOpen(false)
  }, [])

  const handleDateRangePopupToggle = useCallback(() => {
    setIsDateRangePopupOpen((prev) => !prev)
    setIsBaseMapPopupOpen(false)
    setIsMapDrawToolPopupOpen(false)
  }, [])

  const handleMapDrawToolPopupToggle = useCallback(() => {
    setIsMapDrawToolPopupOpen((prev) => !prev)
    setIsBaseMapPopupOpen(false)
    setIsDateRangePopupOpen(false)
  }, [])

  const handleCloseAllPopups = useCallback(() => {
    setIsDateRangePopupOpen(false)
    setIsBaseMapPopupOpen(false)
    setIsMapDrawToolPopupOpen(false)
  }, [])

  const handleLegendToggle = useCallback(() => {
    setIsLegendExpanded((prev) => !prev)
  }, [])

  // Toggle the measure control and clear any sketches to hide its labels when closing
  const handleMeasureTool = useCallback(() => {
    if (!drawRef.current) return

    if (!isMeasuring) {
      setIsMeasuring(true)
      drawRef.current.activate()
      drawRef.current.getTerraDrawInstance().setMode('linestring')
    } else {
      setIsMeasuring(false)
      const terraDrawInstance = drawRef.current.getTerraDrawInstance()

      // get feature IDs and remove by ID to trigger the removal of
      // measure labels added by @watergis/maplibre-gl-terradraw
      const featureIds = terraDrawInstance
        .getSnapshot()
        .map((f) => f.id)
        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number')
      terraDrawInstance.removeFeatures(featureIds)

      drawRef.current.resetActiveMode()
      drawRef.current.deactivate()
    }
  }, [isMeasuring])

  // Activate a single TerraDraw mode at a time across polygon, rectangle, and circle tools
  const activateDrawMode = useCallback(
    (mode: 'polygon' | 'rectangle' | 'circle') => {
      const polygonControl = polygonDrawRef.current
      if (!polygonControl) return

      try {
        const terraDrawInstance = polygonControl.getTerraDrawInstance()
        if (!terraDrawInstance) {
          console.warn('TerraDraw instance not available')
          return
        }

        if (activeDrawMode === mode) {
          terraDrawInstance.setMode('render')
          polygonControl.resetActiveMode()
          polygonControl.deactivate()
          setActiveDrawMode(null)
          return
        }

        if (activeDrawMode) {
          terraDrawInstance.setMode('render')
          polygonControl.resetActiveMode()
          polygonControl.deactivate()
        }

        removeTerraDrawFeatures(terraDrawInstance)
        setPolygonFeatures([])

        polygonControl.activate()
        terraDrawInstance.setMode(mode)
        setActiveDrawMode(mode)
      } catch (error) {
        console.warn('Error activating draw mode:', error)
        // Reset state on error
        setActiveDrawMode(null)
        setPolygonFeatures([])
      }
    },
    [activeDrawMode, setPolygonFeatures],
  )

  // Convenience handlers to wire UI buttons to their respective draw modes
  const handlePolygonDraw = useCallback(() => {
    activateDrawMode('polygon')
  }, [activateDrawMode])

  const handleRectangleDraw = useCallback(() => {
    activateDrawMode('rectangle')
  }, [activateDrawMode])

  const handleCircleDraw = useCallback(() => {
    activateDrawMode('circle')
  }, [activateDrawMode])

  // Clear any drawn geometries and return the polygon control to an idle state
  const handleDeleteDraw = useCallback(() => {
    const polygonControl = polygonDrawRef.current
    if (!polygonControl) return

    const terraDrawInstance = polygonControl.getTerraDrawInstance()
    removeTerraDrawFeatures(terraDrawInstance)
    setPolygonFeatures([])
    terraDrawInstance.setMode('render')
    polygonControl.resetActiveMode()
    polygonControl.deactivate()
    setActiveDrawMode(null)
  }, [setPolygonFeatures])

  const isFeatureInsideSelection = useCallback(
    (featureJson: Feature): boolean => {
      if (!featureJson.geometry || selectionPolygons.length === 0) {
        return false
      }

      const geometryType = featureJson.geometry.type
      if (geometryType !== 'Polygon' && geometryType !== 'MultiPolygon') {
        return false
      }

      try {
        const featureBounds = bbox(featureJson) as BBox
        if (!isValidBoundingBox(featureBounds)) {
          return false
        }

        if (polygonBoundingBoxFeature) {
          const featureBoundingPolygon = bboxPolygon(featureBounds)
          if (!booleanIntersects(polygonBoundingBoxFeature, featureBoundingPolygon)) {
            return false
          }
        }

        const polygonFeature = featureJson as Feature<Polygon | MultiPolygon>

        return selectionPolygons.some((selectionPolygon) => {
          try {
            return booleanWithin(polygonFeature, selectionPolygon)
          } catch (containmentError) {
            console.error('Error evaluating polygon containment:', containmentError)
            return false
          }
        })
      } catch (error) {
        console.error('Error computing feature bounds:', error)
        return false
      }
    },
    [selectionPolygons, polygonBoundingBoxFeature],
  )

  const handleMapChange = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }

    if (!selectedCountryFeature) {
      setContiguousHotspotFeatures([])
      return
    }

    try {
      // Query rendered features with country filter applied directly
      const sourceFeatures = map.queryRenderedFeatures(undefined, {
        layers: [LAYER_IDS.HOTSPOT_FILL],
        filter: ['==', ['get', 'ISO_Ter1'], selectedCountryFeature.properties?.id],
      }) as MapGeoJSONFeature[]

      let featuresWithinDraw = sourceFeatures

      if (polygonBoundingBoxFeature && selectionPolygons.length > 0) {
        featuresWithinDraw = sourceFeatures.filter((feature) =>
          isFeatureInsideSelection(feature.toJSON() as Feature),
        )
      }

      // Extract and enrich features with _pbf data
      const enrichedFeatures = featuresWithinDraw.map(
        (feature) => feature.properties as ContiguousHotspotProperties,
      )

      // Get unique features and apply hotspot radio filter
      const uniqueFeatures = getUniqueHotspotFeatures(enrichedFeatures)
      const filteredFeatures = applyHotspotRadioFilter(uniqueFeatures, hotspotRadio)

      setContiguousHotspotFeatures(filteredFeatures)
    } catch (error) {
      console.error('Error processing map features:', error)
      setContiguousHotspotFeatures([])
    }
  }, [
    selectedCountryFeature,
    setContiguousHotspotFeatures,
    polygonBoundingBoxFeature,
    selectionPolygons,
    isFeatureInsideSelection,
    hotspotRadio,
  ])

  // Return the viewport to the currently selected country's bounding box
  const handleResetToCountryView = () => {
    if (!mapRef.current || !mapInitialViewBox.length) return

    mapRef.current.fitBounds(mapInitialViewBox, { duration: FLY_TO_DURATION })
  }

  // Effects
  // Update map size and fit to country bounds on load or when selected country changes
  useEffect(() => {
    if (!isMapLoaded) return

    const mapContainer = mapRef.current?.getContainer().parentElement
    if (mapContainer) {
      mapContainer.style.transition = 'none'
      mapRef.current?.resize()
      mapContainer.style.transition = ''
    }

    const bounds = createBoundingBox()
    setMapInitialViewBox(bounds)
    mapRef.current?.fitBounds(bounds, { duration: FLY_TO_DURATION })
  }, [isMapLoaded, createBoundingBox])

  useEffect(() => {
    if (!isMapLoaded) return
    handleMapChange()
  }, [isMapLoaded, handleMapChange])

  // Update the ref (separate effect)
  useEffect(() => {
    baseMapRef.current = baseMap
  }, [baseMap])

  useEffect(() => {
    selectedHotspotDataRef.current = selectedHotspotData
  }, [selectedHotspotData])

  // Detach TerraDraw listeners and controls when the component unmounts. Without this cleanup,
  // lingering event listeners and duplicate controls would keep reacting the next time the map mounts.
  useEffect(() => {
    if (!isMapLoaded) {
      return
    }

    const polygonControl = polygonDrawRef.current
    if (!polygonControl) {
      return
    }

    const terraDrawInstance = polygonControl.getTerraDrawInstance()
    const finishHandler = polygonFinishHandlerRef.current
    const mapInstance = mapRef.current?.getMap()

    return () => {
      if (terraDrawInstance && finishHandler) {
        terraDrawInstance.off('finish', finishHandler)
      }

      if (mapInstance) {
        mapInstance.removeControl(polygonControl)
      }
    }
  }, [isMapLoaded])

  // Clear drawn polygons when switching to mobile width to avoid tool UI issues on small screens
  useEffect(() => {
    if (!isMobileWidth) return

    const polygonControl = polygonDrawRef.current
    if (!polygonControl) return

    try {
      const terraDrawInstance = polygonControl.getTerraDrawInstance()
      // Remove any existing features and reset draw state
      removeTerraDrawFeatures(terraDrawInstance)
      setPolygonFeatures([])
      terraDrawInstance.setMode('render')
      polygonControl.resetActiveMode()
      polygonControl.deactivate()
      setActiveDrawMode(null)
      setIsMapDrawToolPopupOpen(false)
    } catch (error) {
      console.warn('Error clearing TerraDraw features when switching to mobile:', error)
    }
  }, [isMobileWidth, setPolygonFeatures])

  // Update shoreline layer visibility and filters
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const shorelineLayers = [
      { id: LAYER_IDS.SHORELINE_UNCERTAIN, filter: SHORELINE_FILTERS.UNCERTAIN },
      { id: LAYER_IDS.SHORELINE_CERTAIN, filter: SHORELINE_FILTERS.CERTAIN },
      { id: LAYER_IDS.SHORELINE_LABELS, filter: undefined },
    ]

    shorelineLayers.forEach(({ id, filter }) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', hideCoastlines ? 'none' : 'visible')
        if (!hideCoastlines) {
          map.setFilter(id, createShorelineFilterExpression(filter))
        }
      }
    })
  }, [createShorelineFilterExpression, hideCoastlines])

  // Update hotspot selection
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const hotspotSelectedColorExpression = getHotspotSelectedColorExpression(baseMapRef.current)
    const selectedUid = selectedHotspotData?.uid || ''

    if (map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
      map.setPaintProperty(LAYER_IDS.HOTSPOT_OUTLINE, 'line-color', [
        'case',
        ['==', ['get', 'uid'], selectedUid],
        hotspotSelectedColorExpression,
        HOTSPOT_OUTLINE_COLOR_EXPRESSION,
      ])
    }
  }, [selectedHotspotData])

  // Update hotspot layer visibility and filters
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }

    const hotspotLayers = [LAYER_IDS.HOTSPOT_FILL, LAYER_IDS.HOTSPOT_OUTLINE]

    hotspotLayers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', isHotspotLayerVisible ? 'visible' : 'none')
        if (isHotspotLayerVisible) {
          map.setFilter(layerId, createHotspotFilterExpression())
        }
      }
    })
  }, [isHotspotLayerVisible, createHotspotFilterExpression])

  // Container classes
  const containerClasses = clsx(styles.mapContainer, {
    [styles.withResultPanel]:
      (selectedCountryFeature || selectedHotspotData) && !isMobileWidth && !isFullscreen,
    [styles.fullWidth]:
      (!selectedCountryFeature && !selectedHotspotData) || isMobileWidth || isFullscreen,
  })

  return (
    <div className={containerClasses}>
      <Map
        id='main-map'
        ref={mapRef}
        style={MAP_STYLE}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={getBaseMapStyle(baseMap)}
        onLoad={handleMapLoad}
        attributionControl={false}
        onIdle={handleMapChange}
      >
        <AttributionControl position='bottom-right' compact />
        <ScaleControl
          key={scaleControlKey}
          position='bottom-left'
          maxWidth={120}
          style={getScaleControlStyle(isHotspotLayerVisible)}
        />
        <NavigationControl
          key={navigationControlKey}
          position={isMobileWidth ? 'top-right' : 'bottom-right'}
          showCompass={false}
          style={NAVIGATION_CONTROL_STYLE}
        />
      </Map>

      {isHotspotLayerVisible && (
        <MapLegend isExpanded={isLegendExpanded} onToggle={handleLegendToggle} />
      )}

      {isFullscreen && !isMobileWidth && (
        <div className={styles.exitFullscreenContainer}>
          <Tooltip content='Exit Fullscreen' side='left'>
            <IconButton onClick={onFullscreenExit} aria-label='Exit Fullscreen' radius='full'>
              <Cross1Icon />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <div className={styles.customMapTools} onClick={(e) => e.stopPropagation()}>
        <div className={styles.mapDrawMeasureGroup}>
          {!isMobileWidth && (
            <Tooltip content='Draw' side='left'>
              <IconButton onClick={handleMapDrawToolPopupToggle} aria-label='Draw'>
                <DrawIcon className={clsx(isMapDrawToolPopupOpen && styles.activeButton)} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip content={isMeasuring ? 'Stop Measuring' : 'Measure'} side='left'>
            <IconButton onClick={handleMeasureTool} aria-label='Measure'>
              <StraightenRoundedIcon className={clsx(isMeasuring && styles.activeButton)} />
            </IconButton>
          </Tooltip>
        </div>

        <Tooltip content='Adjust Coastlines' side='left'>
          <IconButton onClick={handleDateRangePopupToggle} aria-label='Adjust Coastlines'>
            <WaterRoundedIcon className={clsx(isDateRangePopupOpen && styles.activeButton)} />
          </IconButton>
        </Tooltip>

        <Tooltip content='Reset to country view' side='left'>
          <IconButton onClick={handleResetToCountryView} aria-label='Reset to country view'>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip content='Change basemap or add layers' side='left'>
          <IconButton onClick={handleBaseMapPopupToggle} aria-label='Change basemap or add layers'>
            <LayersIcon className={clsx(isBaseMapPopupOpen && styles.activeButton)} />
          </IconButton>
        </Tooltip>

        <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} side='left'>
          <IconButton
            onClick={onFullscreenToggle}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <img
              src={isFullscreen ? ExitFullScreenIcon : EnterFullScreenIcon}
              alt={isFullscreen ? 'Exit Fullscreen Icon' : 'Fullscreen Icon'}
            />
          </IconButton>
        </Tooltip>

        {isMapDrawToolPopupOpen && (
          <MapDrawPopup
            activeDrawMode={activeDrawMode}
            onPolygonDraw={handlePolygonDraw}
            onRectangleDraw={handleRectangleDraw}
            onCircleDraw={handleCircleDraw}
            onDeleteDraw={handleDeleteDraw}
          />
        )}

        {isDateRangePopupOpen && <DateRangePopup />}

        {isBaseMapPopupOpen && (
          <BaseMapPopup
            baseMap={baseMap}
            isBuildingsLayerVisible={isBuildingsLayerVisible}
            isMangrovesLayerVisible={isMangrovesLayerVisible}
            onBaseMapSelection={handleBaseMapSelection}
            onBuildingToggle={handleBuildingToggle}
            onMangroveToggle={handleMangroveToggle}
          />
        )}
      </div>

      {/* Invisible overlay that captures clicks outside popups to close them, but excludes the map tools area */}
      {(isDateRangePopupOpen || isBaseMapPopupOpen) && (
        <div
          className={styles.popupBackdrop}
          onClick={handleCloseAllPopups}
          aria-label='Close popup by clicking outside'
        />
      )}
    </div>
  )
}
