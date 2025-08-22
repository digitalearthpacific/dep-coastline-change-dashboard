import { useRef, useEffect, useState, useCallback } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent, Map as MapLibreMap } from 'maplibre-gl'
import type { MapRef, MapMouseEvent } from 'react-map-gl/maplibre'
import type { FilterSpecification } from 'maplibre-gl'
import { IconButton, Tooltip } from '@radix-ui/themes'
import { Cross1Icon, LayersIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import 'maplibre-gl/dist/maplibre-gl.css'

import styles from './MainMap.module.scss'
import EnterFullScreenIcon from '../../assets/fullscreen.svg'
import ExitFullScreenIcon from '../../assets/fullscreen-exit.svg'
import {
  MAP_CONFIG,
  BASE_MAPS,
  LAYER_IDS,
  SOURCE_IDS,
  SHORELINE_FILTERS,
  LEGEND_ITEMS,
  SHORELINE_COLOR_EXPRESSION,
  HOTSPOT_COLOR_EXPRESSION,
  HOTSPOT_OPACITY_EXPRESSION,
  TILE_URLS,
} from '../../library/constants'
import type { MainMapProps, MapStyleType } from '../../library/types'
import type { ContiguousHotspotProperties } from '../../library/types/countryGeoJsonTypes'
import useResponsive from '../../hooks/useResponsive'
import { useChart, useCountry } from '../../hooks/useGlobalContext'
import { BaseMapPopup } from '../BaseMapPopup/BaseMapPopup'

// Helper functions
const getBaseMapStyle = (baseMap: MapStyleType): string => {
  const map = BASE_MAPS.find((bm) => bm.key === baseMap)
  return map?.styleUrl ?? BASE_MAPS[0].styleUrl
}

// Sub-components
const MapLegend = () => (
  <div className={styles.mapLegend}>
    <div className={styles.legendTitle}>Hot Spots</div>
    <div className={styles.legendSubtitle}>Levels of change</div>
    <div className={styles.legendItems}>
      {LEGEND_ITEMS.map(({ key, label, text, extraStyleClass }) => (
        <div key={key} className={styles.legendItem}>
          <div className={clsx(styles.legendCircle, styles[extraStyleClass])}></div>
          <span className={styles.legendText}>
            <strong>{label}</strong> {text}
          </span>
        </div>
      ))}
    </div>
  </div>
)

// Main Component
export const MainMap = ({
  isFullscreen,
  onFullscreenToggle,
  onFullscreenExit,
  selectedHotspotData,
  handleHotspotDataChange,
}: MainMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const { isMobileWidth } = useResponsive()
  const { selectedCountryFeature } = useCountry()
  const { startDate, endDate } = useChart()

  // State
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isBaseMapPopupOpen, setIsBaseMapPopupOpen] = useState(false)
  const [baseMap, setBaseMap] = useState<MapStyleType>('default')
  const [isBuildingsLayerVisible, setIsBuildingsLayerVisible] = useState(true)
  const [isMangrovesLayerVisible, setIsMangrovesLayerVisible] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Computed values
  const navigationControlKey = `nav-control-${isMobileWidth ? 'mobile' : 'desktop'}`
  const isShorelineLayerVisible = Boolean(startDate && endDate)
  const isHotspotLayerVisible = Boolean(selectedCountryFeature)

  // Date filter creation
  const createDateFilter = useCallback(
    (certaintyCriteria?: FilterSpecification): FilterSpecification => {
      const filters: FilterSpecification[] = []

      if (certaintyCriteria) {
        filters.push(certaintyCriteria)
      }

      if (startDate && endDate) {
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
    [startDate, endDate],
  )

  // Bbox options for country fitting
  const createBBoxOptions = useCallback(() => {
    if (!selectedCountryFeature?.bbox) return null

    const [minX, minY, maxX, maxY] = selectedCountryFeature.bbox as [number, number, number, number]
    return {
      bounds: [
        [minX, minY],
        [maxX, maxY],
      ] as [[number, number], [number, number]],
      duration: MAP_CONFIG.FLY_TO_DURATION,
    }
  }, [selectedCountryFeature])

  // Layer management functions
  const addBuildingsLayer = useCallback(
    (map: MapLibreMap) => {
      if (!map.getSource(SOURCE_IDS.BUILDINGS)) {
        map.addSource(SOURCE_IDS.BUILDINGS, {
          type: 'vector',
          tiles: [TILE_URLS.BUILDINGS],
        })
      }

      if (!map.getLayer(LAYER_IDS.BUILDINGS)) {
        map.addLayer({
          id: LAYER_IDS.BUILDINGS,
          type: 'fill',
          minzoom: 0,
          maxzoom: 13,
          source: SOURCE_IDS.BUILDINGS,
          'source-layer': 'buildings',
          layout: { visibility: isBuildingsLayerVisible ? 'visible' : 'none' },
          paint: {
            'fill-color': '#eb8730',
            'fill-outline-color': '#4e4e4e',
            'fill-opacity': 0.8,
          },
        })
      }
    },
    [isBuildingsLayerVisible],
  )

  const addMangrovesLayer = useCallback(
    (map: MapLibreMap) => {
      if (!map.getSource(SOURCE_IDS.MANGROVES)) {
        map.addSource(SOURCE_IDS.MANGROVES, {
          type: 'raster',
          tiles: [TILE_URLS.MANGROVES],
          tileSize: 512,
        })
      }

      if (!map.getLayer(LAYER_IDS.MANGROVES)) {
        map.addLayer({
          id: LAYER_IDS.MANGROVES,
          type: 'raster',
          source: SOURCE_IDS.MANGROVES,
          layout: { visibility: isMangrovesLayerVisible ? 'visible' : 'none' },
          paint: { 'raster-opacity': 0.6 },
        })
      }
    },
    [isMangrovesLayerVisible],
  )

  const addShorelineChangeLayer = useCallback(
    (map: MapLibreMap) => {
      if (!map.getSource(SOURCE_IDS.COASTLINES)) {
        map.addSource(SOURCE_IDS.COASTLINES, {
          type: 'vector',
          url: TILE_URLS.COASTLINES,
        })
      }

      const layerConfigs = [
        {
          id: LAYER_IDS.SHORELINE_UNCERTAIN,
          filter: createDateFilter(SHORELINE_FILTERS.UNCERTAIN),
          paint: {
            'line-color': SHORELINE_COLOR_EXPRESSION,
            'line-width': 2,
            'line-opacity': 0.8,
            'line-dasharray': [4, 4],
          },
        },
        {
          id: LAYER_IDS.SHORELINE_CERTAIN,
          filter: createDateFilter(SHORELINE_FILTERS.CERTAIN),
          paint: {
            'line-color': SHORELINE_COLOR_EXPRESSION,
            'line-width': 2.5,
            'line-opacity': 1,
          },
        },
      ]

      layerConfigs.forEach(({ id, filter, paint }) => {
        if (!map.getLayer(id)) {
          map.addLayer({
            id,
            type: 'line',
            minzoom: 13,
            maxzoom: 22,
            source: SOURCE_IDS.COASTLINES,
            'source-layer': 'shorelines_annual',
            filter,
            layout: { visibility: isShorelineLayerVisible ? 'visible' : 'none' },
            paint,
          })
        }
      })

      if (!map.getLayer(LAYER_IDS.SHORELINE_LABELS)) {
        map.addLayer({
          id: LAYER_IDS.SHORELINE_LABELS,
          minzoom: 13,
          maxzoom: 22,
          type: 'symbol',
          source: SOURCE_IDS.COASTLINES,
          'source-layer': 'shorelines_annual',
          layout: {
            'text-field': '{year}',
            'symbol-placement': 'line',
            'text-size': 12,
            visibility: isShorelineLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'text-color': 'white',
            'text-halo-color': '#444444',
            'text-halo-width': 2,
          },
        })
      }
    },
    [createDateFilter, isShorelineLayerVisible],
  )

  const addContiguousHotspot = useCallback(
    (map: MapLibreMap) => {
      if (!map.getSource(SOURCE_IDS.HOTSPOTS)) {
        map.addSource(SOURCE_IDS.HOTSPOTS, {
          type: 'vector',
          tiles: [TILE_URLS.HOTSPOTS],
          minzoom: 0,
          maxzoom: 13,
        })
      }

      // Add hotspot fill layer
      if (!map.getLayer(LAYER_IDS.HOTSPOT_FILL)) {
        map.addLayer({
          id: LAYER_IDS.HOTSPOT_FILL,
          type: 'fill',
          source: SOURCE_IDS.HOTSPOTS,
          'source-layer': 'contiguous_hotspots',
          layout: { visibility: isHotspotLayerVisible ? 'visible' : 'none' },
          paint: {
            'fill-color': HOTSPOT_COLOR_EXPRESSION,
            'fill-opacity': HOTSPOT_OPACITY_EXPRESSION,
          },
        })
      }

      // Add hotspot outline layer
      if (!map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
        map.addLayer({
          id: LAYER_IDS.HOTSPOT_OUTLINE,
          type: 'line',
          source: SOURCE_IDS.HOTSPOTS,
          'source-layer': 'contiguous_hotspots',
          layout: { visibility: isHotspotLayerVisible ? 'visible' : 'none' },
          paint: {
            'line-color': HOTSPOT_COLOR_EXPRESSION,
            'line-opacity': HOTSPOT_OPACITY_EXPRESSION,
            'line-width': ['case', ['==', ['get', 'uid'], selectedHotspotData?.uid || ''], 5, 0.5],
          },
        })
      }
    },
    [selectedHotspotData, isHotspotLayerVisible],
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
    if (!map) return

    // Add all layers
    addShorelineChangeLayer(map)
    addBuildingsLayer(map)
    addMangrovesLayer(map)
    addContiguousHotspot(map)

    // Setup hotspot interactions
    const handleHotspotClick = (e: MapLayerMouseEvent) => {
      if (e.features?.[0]) {
        const featureProperties = e.features[0].properties as ContiguousHotspotProperties
        handleHotspotDataChange(featureProperties)
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

    // Add event listeners
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
  ])

  const handleBaseMapSelection = useCallback(
    (mapKey: MapStyleType) => {
      setBaseMap(mapKey)
      setIsBaseMapPopupOpen(false)

      const map = mapRef.current?.getMap()
      if (map) {
        map.once('styledata', () => {
          addBuildingsLayer(map)
          addMangrovesLayer(map)
          addShorelineChangeLayer(map)
          addContiguousHotspot(map)
        })
      }
    },
    [addBuildingsLayer, addMangrovesLayer, addShorelineChangeLayer, addContiguousHotspot],
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
  }, [])

  // Effects
  useEffect(() => {
    if (!isMapLoaded || !selectedCountryFeature || shouldAnimate) return

    const mapContainer = mapRef.current?.getContainer().parentElement
    if (mapContainer) {
      mapContainer.style.transition = 'none'
      mapRef.current?.resize()
      mapContainer.style.transition = ''

      const bboxOptions = createBBoxOptions()
      if (bboxOptions) {
        mapRef.current?.fitBounds(bboxOptions.bounds, { duration: bboxOptions.duration })
      }
      setShouldAnimate(true)
    }
  }, [isMapLoaded, selectedCountryFeature, shouldAnimate, createBBoxOptions])

  useEffect(() => {
    if (!isMapLoaded || !shouldAnimate || !selectedCountryFeature) return

    const bboxOptions = createBBoxOptions()
    if (bboxOptions) {
      mapRef.current?.fitBounds(bboxOptions.bounds, { duration: bboxOptions.duration })
    }
  }, [selectedCountryFeature, shouldAnimate, createBBoxOptions, isMapLoaded])

  useEffect(() => {
    if (!selectedCountryFeature) setShouldAnimate(false)
  }, [selectedCountryFeature])

  // Update shoreline layers
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const layerConfigs = [
      { id: LAYER_IDS.SHORELINE_UNCERTAIN, filter: SHORELINE_FILTERS.UNCERTAIN },
      { id: LAYER_IDS.SHORELINE_CERTAIN, filter: SHORELINE_FILTERS.CERTAIN },
      { id: LAYER_IDS.SHORELINE_LABELS, filter: undefined },
    ]

    layerConfigs.forEach(({ id, filter }) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', isShorelineLayerVisible ? 'visible' : 'none')
        if (isShorelineLayerVisible) {
          map.setFilter(id, createDateFilter(filter))
        }
      }
    })
  }, [createDateFilter, isShorelineLayerVisible])

  // Update hotspot selection
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapLoaded) return

    const selectedUid = selectedHotspotData?.uid || ''
    if (map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
      map.setPaintProperty(LAYER_IDS.HOTSPOT_OUTLINE, 'line-width', [
        'case',
        ['==', ['get', 'uid'], selectedUid],
        5,
        0.5,
      ])
    }
  }, [isMapLoaded, selectedHotspotData])

  // Update hotspot layer visibility
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    ;[LAYER_IDS.HOTSPOT_FILL, LAYER_IDS.HOTSPOT_OUTLINE].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', isHotspotLayerVisible ? 'visible' : 'none')
      }
    })
  }, [isHotspotLayerVisible])

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
        style={MAP_CONFIG.MAP_STYLE}
        initialViewState={MAP_CONFIG.INITIAL_VIEW_STATE}
        mapStyle={getBaseMapStyle(baseMap)}
        onLoad={handleMapLoad}
        attributionControl={false}
      >
        <AttributionControl position='bottom-left' compact />
        <NavigationControl
          key={navigationControlKey}
          position={isMobileWidth ? 'top-right' : 'bottom-right'}
          showCompass={false}
          style={MAP_CONFIG.NAVIGATION_CONTROL_STYLE}
        />
      </Map>

      <MapLegend />

      {isFullscreen && !isMobileWidth && (
        <div className={styles.exitFullscreenContainer}>
          <Tooltip content='Exit Fullscreen' side='left'>
            <IconButton onClick={onFullscreenExit} aria-label='Exit Fullscreen' radius='full'>
              <Cross1Icon />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <div className={styles.customMapTools}>
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

        <Tooltip content='Change basemap or add layers' side='left'>
          <IconButton onClick={handleBaseMapPopupToggle} aria-label='Change basemap or add layers'>
            <LayersIcon />
          </IconButton>
        </Tooltip>

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
    </div>
  )
}
