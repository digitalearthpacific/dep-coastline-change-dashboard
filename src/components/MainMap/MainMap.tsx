import { useRef, useEffect, useState, useCallback } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent, Map as MapLibreMap } from 'maplibre-gl'
import type { MapRef } from 'react-map-gl/maplibre'
import type { FilterSpecification } from 'maplibre-gl'
import { Checkbox, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { Cross1Icon, LayersIcon } from '@radix-ui/react-icons'
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
} from '../../library/constants'
import type { MainMapProps, MapStyleType } from '../../library/types'
import useResponsive from '../../hooks/useResponsive'
import clsx from 'clsx'
import { useChart, useCountry } from '../../hooks/useGlobalContext'
import type { MapMouseEvent } from 'react-map-gl/mapbox'
import type { ContiguousHotspotProperties } from '../../library/types/countryGeoJsonTypes'

// Constants
const MAP_STYLE = {
  width: '100%',
  height: '100%',
}

const NAVIGATION_CONTROL_STYLE = {
  marginBottom: 'var(--navigation-control-margin-bottom, 106px)',
  marginRight: 'var(--navigation-control-margin-right, 24px)',
}

// Helper functions
const getBaseMapStyle = (baseMap: MapStyleType): string => {
  const map = BASE_MAPS.find((bm) => bm.key === baseMap)
  return map ? map.styleUrl : BASE_MAPS[0].styleUrl
}

// Components
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

interface BaseMapPopupProps {
  baseMap: MapStyleType
  isBuildingsLayerVisible: boolean
  isMangrovesLayerVisible: boolean
  onBaseMapSelection: (mapKey: MapStyleType) => void
  onBuildingToggle: () => void
  onMangroveToggle: () => void
}

const BaseMapPopup = ({
  baseMap,
  isBuildingsLayerVisible,
  isMangrovesLayerVisible,
  onBaseMapSelection,
  onBuildingToggle,
  onMangroveToggle,
}: BaseMapPopupProps) => (
  <div className={styles.baseMapPopup}>
    <div className={styles.popupSection}>
      <div className={styles.mapTypeTitle}>Basemaps</div>
      <div className={styles.mapTypeContainer}>
        {BASE_MAPS.map((bm) => (
          <button
            key={bm.key}
            aria-label={`Select ${bm.label} basemap`}
            className={clsx(styles.baseMapButton, {
              [styles.selected]: baseMap === bm.key,
            })}
            onClick={() => onBaseMapSelection(bm.key)}
          >
            <img src={bm.thumbnail} alt={bm.label} />
            <div>{bm.label}</div>
          </button>
        ))}
      </div>
    </div>
    <div className={styles.popupSection}>
      <div className={styles.mapTypeTitle}>Map Layers</div>
      <Flex gap='2' align='center'>
        <Checkbox
          size='2'
          variant='surface'
          className={styles.checkboxButton}
          checked={isBuildingsLayerVisible}
          onCheckedChange={onBuildingToggle}
        />
        <Text size='2'>Buildings</Text>
      </Flex>
      <Flex gap='2' align='center'>
        <Checkbox
          size='2'
          variant='classic'
          className={styles.checkboxButton}
          checked={isMangrovesLayerVisible}
          onCheckedChange={onMangroveToggle}
        />
        <Text size='2'>Mangroves</Text>
      </Flex>
    </div>
  </div>
)

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

  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isBaseMapPopupOpen, setIsBaseMapPopupOpen] = useState(false)
  const [baseMap, setBaseMap] = useState<MapStyleType>('default')
  const [isBuildingsLayerVisible, setIsBuildingsLayerVisible] = useState(true)
  const [isMangrovesLayerVisible, setIsMangrovesLayerVisible] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const navigationControlKey = `nav-control-${isMobileWidth ? 'mobile' : 'desktop'}`
  const isShorelineLayerVisible = Boolean(startDate && endDate)
  const isHotspotLayerVisible = Boolean(selectedCountryFeature)

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

  const createBBoxOptions = useCallback(() => {
    if (!selectedCountryFeature?.bbox) return null

    const selectedBbox = selectedCountryFeature.bbox as [number, number, number, number]

    return {
      bounds: [
        [selectedBbox[0], selectedBbox[1]],
        [selectedBbox[2], selectedBbox[3]],
      ] as [[number, number], [number, number]],
      duration: MAP_CONFIG.FLY_TO_DURATION,
    }
  }, [selectedCountryFeature])

  const addBuildingsLayer = useCallback(
    (map: MapLibreMap) => {
      if (!map.getSource(SOURCE_IDS.BUILDINGS)) {
        map.addSource(SOURCE_IDS.BUILDINGS, {
          type: 'vector',
          tiles: ['https://tileserver.prod.digitalearthpacific.io/data/buildings/{z}/{x}/{y}.pbf'],
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
          layout: {
            visibility: isBuildingsLayerVisible ? 'visible' : 'none',
          },
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
          tiles: [
            'https://ows.prod.digitalearthpacific.io/wms?' +
              'SERVICE=WMS' +
              '&VERSION=1.3.0' +
              '&REQUEST=GetMap' +
              '&LAYERS=mangroves' +
              '&STYLES=style_mangroves' +
              '&FORMAT=image/png' +
              '&TRANSPARENT=true' +
              '&CRS=EPSG:3857' +
              '&WIDTH=512' +
              '&HEIGHT=512' +
              '&BBOX={bbox-epsg-3857}',
          ],
          tileSize: 512,
        })
      }

      if (!map.getLayer(LAYER_IDS.MANGROVES)) {
        map.addLayer({
          id: LAYER_IDS.MANGROVES,
          type: 'raster',
          source: SOURCE_IDS.MANGROVES,
          layout: {
            visibility: isMangrovesLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'raster-opacity': 0.6,
          },
        })
      }
    },
    [isMangrovesLayerVisible],
  )

  const addShorelineChangeLayer = useCallback(
    (map: MapLibreMap) => {
      const uncertaintyFilter = createDateFilter(SHORELINE_FILTERS.UNCERTAIN)
      const certaintyFilter = createDateFilter(SHORELINE_FILTERS.CERTAIN)

      if (!map.getSource(SOURCE_IDS.COASTLINES)) {
        map.addSource(SOURCE_IDS.COASTLINES, {
          type: 'vector',
          url: 'https://tileserver.prod.digitalearthpacific.io/data/coastlines.json',
        })
      }

      if (!map.getLayer(LAYER_IDS.SHORELINE_UNCERTAIN)) {
        map.addLayer({
          id: LAYER_IDS.SHORELINE_UNCERTAIN,
          type: 'line',
          minzoom: 13,
          maxzoom: 22,
          source: SOURCE_IDS.COASTLINES,
          'source-layer': 'shorelines_annual',
          filter: uncertaintyFilter,
          layout: {
            visibility: isShorelineLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'line-color': SHORELINE_COLOR_EXPRESSION,
            'line-width': 2,
            'line-opacity': 0.8,
            'line-dasharray': [4, 4],
          },
        })
      }

      if (!map.getLayer(LAYER_IDS.SHORELINE_CERTAIN)) {
        map.addLayer({
          id: LAYER_IDS.SHORELINE_CERTAIN,
          type: 'line',
          minzoom: 13,
          maxzoom: 22,
          source: SOURCE_IDS.COASTLINES,
          'source-layer': 'shorelines_annual',
          filter: certaintyFilter,
          layout: {
            visibility: isShorelineLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'line-color': SHORELINE_COLOR_EXPRESSION,
            'line-width': 2.5,
            'line-opacity': 1,
          },
        })
      }

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
          tiles: [
            'https://tileserver.prod.digitalearthpacific.io/data/dashboard-hotspot-stats/{z}/{x}/{y}.pbf',
          ],
          minzoom: 0,
          maxzoom: 13,
        })
      }

      if (!map.getLayer(LAYER_IDS.HOTSPOT_FILL)) {
        map.addLayer({
          id: LAYER_IDS.HOTSPOT_FILL,
          type: 'fill',
          source: SOURCE_IDS.HOTSPOTS,
          'source-layer': 'contiguous_hotspots',
          layout: {
            visibility: isHotspotLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'fill-color': HOTSPOT_COLOR_EXPRESSION,
            'fill-opacity': HOTSPOT_OPACITY_EXPRESSION,
          },
        })
      }

      if (!map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
        map.addLayer({
          id: LAYER_IDS.HOTSPOT_OUTLINE,
          type: 'line',
          source: SOURCE_IDS.HOTSPOTS,
          'source-layer': 'contiguous_hotspots',
          layout: {
            visibility: isHotspotLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'line-color': HOTSPOT_COLOR_EXPRESSION,
            'line-opacity': HOTSPOT_OPACITY_EXPRESSION,
            'line-width': [
              'case',
              ['==', ['get', 'uid'], selectedHotspotData?.uid || ''],
              5, // Thicker when selected
              0.5, // Normal width
            ],
          },
        })
      }
    },
    [selectedHotspotData, isHotspotLayerVisible],
  )

  const handleMapLoad = useCallback(() => {
    const removeNativeTooltips = () => {
      const controls = mapRef.current
        ?.getContainer()
        .querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out')

      controls?.forEach((control) => control.removeAttribute('title'))
    }

    requestAnimationFrame(removeNativeTooltips)

    const map = mapRef.current?.getMap()
    if (!map) return

    addShorelineChangeLayer(map)
    addBuildingsLayer(map)
    addMangrovesLayer(map)
    addContiguousHotspot(map)

    // Add click handler for hotspot layers
    const handleHotspotClick = (e: MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const featureProperties = e.features[0].properties as ContiguousHotspotProperties
        handleHotspotDataChange(featureProperties)
      }
    }

    // Clear selection when clicking elsewhere on the map (NOT on hotspot features)
    const handleMapClick = (e: MapMouseEvent) => {
      // Query the map at the click point to check if we clicked on hotspot layers
      const hotspotFeatures = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_IDS.HOTSPOT_FILL, LAYER_IDS.HOTSPOT_OUTLINE],
      })

      // Only clear selection if we didn't click on any hotspot features
      if (!hotspotFeatures || hotspotFeatures.length === 0) {
        handleHotspotDataChange(null)
      }
    }

    // Add click listeners for both hotspot layers
    map.on('click', LAYER_IDS.HOTSPOT_FILL, handleHotspotClick)
    map.on('click', LAYER_IDS.HOTSPOT_OUTLINE, handleHotspotClick)
    map.on('click', handleMapClick)

    // Change cursor on hover
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

  const toggleLayerVisibility = useCallback(
    (layerId: string, currentVisibility: boolean, setVisibility: (visible: boolean) => void) => {
      const map = mapRef.current?.getMap()
      if (!map) return

      const newVisibility = !currentVisibility
      setVisibility(newVisibility)
      map.setLayoutProperty(layerId, 'visibility', newVisibility ? 'visible' : 'none')
    },
    [],
  )

  const handleBuildingToggle = useCallback(() => {
    toggleLayerVisibility(LAYER_IDS.BUILDINGS, isBuildingsLayerVisible, setIsBuildingsLayerVisible)
  }, [toggleLayerVisibility, isBuildingsLayerVisible])

  const handleMangroveToggle = useCallback(() => {
    toggleLayerVisibility(LAYER_IDS.MANGROVES, isMangrovesLayerVisible, setIsMangrovesLayerVisible)
  }, [toggleLayerVisibility, isMangrovesLayerVisible])

  const handleBaseMapPopupToggle = useCallback(() => {
    setIsBaseMapPopupOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !selectedCountryFeature || shouldAnimate) return

    const mapContainer = mapRef.current.getContainer().parentElement
    if (mapContainer) {
      mapContainer.style.transition = 'none'
      mapRef.current.resize()
      mapContainer.style.transition = ''
      const bboxOptions = createBBoxOptions()
      if (bboxOptions) {
        mapRef.current.fitBounds(bboxOptions.bounds, {
          duration: bboxOptions.duration,
        })
      }
      setShouldAnimate(true)
    }
  }, [isMapLoaded, selectedCountryFeature, shouldAnimate, createBBoxOptions])

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !shouldAnimate || !selectedCountryFeature) return

    const bboxOptions = createBBoxOptions()
    if (bboxOptions) {
      mapRef.current.fitBounds(bboxOptions.bounds, {
        duration: bboxOptions.duration,
      })
    }
  }, [selectedCountryFeature, shouldAnimate, createBBoxOptions, isMapLoaded])

  useEffect(() => {
    if (!selectedCountryFeature) {
      setShouldAnimate(false)
    }
  }, [selectedCountryFeature])

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

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapLoaded) return

    const selectedUid = selectedHotspotData?.uid || ''

    // Outline layer update
    if (map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
      // Only line-width changes when selected
      map.setPaintProperty(LAYER_IDS.HOTSPOT_OUTLINE, 'line-width', [
        'case',
        ['==', ['get', 'uid'], selectedUid],
        5, // Thicker when selected
        0.5, // Normal width
      ])
    }
  }, [isMapLoaded, selectedHotspotData])

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    if (map.getLayer(LAYER_IDS.HOTSPOT_FILL)) {
      map.setLayoutProperty(
        LAYER_IDS.HOTSPOT_FILL,
        'visibility',
        isHotspotLayerVisible ? 'visible' : 'none',
      )
    }

    if (map.getLayer(LAYER_IDS.HOTSPOT_OUTLINE)) {
      map.setLayoutProperty(
        LAYER_IDS.HOTSPOT_OUTLINE,
        'visibility',
        isHotspotLayerVisible ? 'visible' : 'none',
      )
    }
  }, [isHotspotLayerVisible])

  return (
    <div
      className={clsx(styles.mapContainer, {
        [styles.withResultPanel]:
          (selectedCountryFeature && !isMobileWidth && !isFullscreen) ||
          (selectedHotspotData && !isMobileWidth && !isFullscreen),
        [styles.fullWidth]:
          (!selectedCountryFeature && !selectedHotspotData) || isMobileWidth || isFullscreen,
      })}
    >
      <Map
        id='main-map'
        ref={mapRef}
        style={MAP_STYLE}
        initialViewState={MAP_CONFIG.INITIAL_VIEW_STATE}
        mapStyle={getBaseMapStyle(baseMap)}
        onLoad={handleMapLoad}
        attributionControl={false}
      >
        <AttributionControl position='bottom-left' compact={true} />
        <NavigationControl
          key={navigationControlKey}
          position={isMobileWidth ? 'top-right' : 'bottom-right'}
          showCompass={false}
          style={NAVIGATION_CONTROL_STYLE}
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
