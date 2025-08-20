import { useRef, useEffect, useState, useCallback } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { MapRef } from 'react-map-gl/maplibre'
import type { ExpressionSpecification } from 'maplibre-gl'
import { Checkbox, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { Cross1Icon } from '@radix-ui/react-icons'
import 'maplibre-gl/dist/maplibre-gl.css'

import styles from './MainMap.module.scss'
import BaseMapIcon from '../../assets/basemap.svg'
import EnterFullScreenIcon from '../../assets/fullscreen.svg'
import ExitFullScreenIcon from '../../assets/fullscreen-exit.svg'
import {
  INITIAL_VIEW_STATE,
  FLY_TO_DESKTOP_ZOOM,
  FLY_TO_MOBILE_ZOOM,
  FLY_TO_DURATION,
  FLY_TO_PRESETS,
  BASE_MAPS,
} from '../../library/constants'
import type { MainMapProps, MapStyleType } from '../../library/types'
import useResponsive from '../../hooks/useResponsive'
import clsx from 'clsx'
import { useChart, useCountry } from '../../hooks/useGlobalContext'

const MAP_STYLE = {
  width: '100%',
  height: '100%',
}

const NAVIGATION_CONTROL_STYLE = {
  marginBottom: 'var(--navigation-control-margin-bottom, 106px)',
  marginRight: 'var(--navigation-control-margin-right, 24px)',
}

const getBaseMapStyle = (baseMap: MapStyleType) => {
  const map = BASE_MAPS.find((bm) => bm.key === baseMap)
  return map ? map.styleUrl : BASE_MAPS[0].styleUrl
}

const MapLegend = () => {
  const legendItems = [
    { key: 'high', label: '>5 m', text: 'High', className: styles.highChange },
    { key: 'moderate', label: '3-5 m', text: 'Moderate', className: styles.moderateChange },
    { key: 'low', label: '2-3 m', text: 'Low', className: styles.lowChange },
  ]

  return (
    <div className={styles.mapLegend}>
      <div className={styles.legendTitle}>Hot Spots</div>
      <div className={styles.legendSubtitle}>Levels of change</div>
      <div className={styles.legendItems}>
        {legendItems.map(({ key, label, text, className }) => (
          <div key={key} className={styles.legendItem}>
            <div className={clsx(styles.legendCircle, className)}></div>
            <span className={styles.legendText}>
              <strong>{label}</strong> {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const BaseMapPopup = ({
  baseMap,
  isBuildingsLayerVisible,
  isMangrovesLayerVisible,
  onBaseMapSelection,
  onBuildingToggle,
  onMangroveToggle,
}: {
  baseMap: MapStyleType
  isBuildingsLayerVisible: boolean
  isMangrovesLayerVisible: boolean
  onBaseMapSelection: (mapKey: MapStyleType) => void
  onBuildingToggle: () => void
  onMangroveToggle: () => void
}) => (
  <div className={styles.baseMapPopup}>
    <div className={styles.mapTypeTitle}>Basemaps</div>
    <div className={styles.mapTypeContainer}>
      {BASE_MAPS.map((bm) => (
        <button
          key={bm.key}
          aria-label={`Select ${bm.label} basemap`}
          className={baseMap === bm.key ? styles.selected : ''}
          onClick={() => onBaseMapSelection(bm.key)}
        >
          <img src={bm.thumbnail} alt={bm.label} />
          <div>{bm.label}</div>
        </button>
      ))}
    </div>
    <div className={styles.mapTypeTitle}>Map Layers</div>
    <Flex gap='2' align='center'>
      <Checkbox
        size='2'
        variant='surface'
        checked={isBuildingsLayerVisible}
        onCheckedChange={onBuildingToggle}
      />{' '}
      <Text size='2'>Buildings</Text>
    </Flex>
    <Flex gap='2' align='center'>
      <Checkbox
        size='2'
        variant='surface'
        checked={isMangrovesLayerVisible}
        onCheckedChange={onMangroveToggle}
      />{' '}
      <Text size='2'>Mangroves</Text>
    </Flex>
  </div>
)

export const MainMap = ({ isFullscreen, onFullscreenToggle, onFullscreenExit }: MainMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const { isMobileWidth } = useResponsive()
  const { selectedCountry } = useCountry()
  const { startDate, endDate } = useChart()

  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isBaseMapPopupOpen, setIsBaseMapPopupOpen] = useState(false)
  const [baseMap, setBaseMap] = useState<MapStyleType>('default')
  const [isBuildingsLayerVisible, setIsBuildingsLayerVisible] = useState(true)
  const [isMangrovesLayerVisible, setIsMangrovesLayerVisible] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const navigationControlKey = `nav-control-${isMobileWidth ? 'mobile' : 'desktop'}`

  const createDateFilter = useCallback(
    (certaintyCriteria: ExpressionSpecification) => {
      const filters = [certaintyCriteria]

      if (startDate && endDate) {
        filters.push(
          ['>=', ['get', 'year'], parseInt(startDate)],
          ['<=', ['get', 'year'], parseInt(endDate)],
        )
      }

      return filters.length === 1 ? certaintyCriteria : ['all', ...filters]
    },
    [startDate, endDate],
  )

  const createFlyToOptions = useCallback(
    (preset: keyof typeof FLY_TO_PRESETS) => {
      const defaultFlyToZoom = isMobileWidth ? FLY_TO_MOBILE_ZOOM : FLY_TO_DESKTOP_ZOOM

      const result = {
        center: selectedCountry?.coordinates as [number, number],
        zoom: defaultFlyToZoom,
        duration: FLY_TO_DURATION,
        ...FLY_TO_PRESETS[preset],
      }
      return result
    },
    [selectedCountry, isMobileWidth],
  )

  const addBuildingsLayer = useCallback(
    (map: MapLibreMap) => {
      if (!map.getSource('buildings')) {
        map.addSource('buildings', {
          type: 'vector',
          tiles: ['https://tileserver.prod.digitalearthpacific.io/data/buildings/{z}/{x}/{y}.pbf'],
        })
      }

      if (!map.getLayer('Buildings')) {
        map.addLayer({
          id: 'Buildings',
          type: 'fill',
          minzoom: 0,
          maxzoom: 13,
          source: 'buildings',
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
      if (!map.getSource('mangroves')) {
        map.addSource('mangroves', {
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

      if (!map.getLayer('Mangroves')) {
        map.addLayer({
          id: 'Mangroves',
          type: 'raster',
          source: 'mangroves',
          layout: {
            visibility: isMangrovesLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'raster-opacity': 0.8,
          },
        })
      }
    },
    [isMangrovesLayerVisible],
  )

  const addShorelineChangeLayer = useCallback(
    (map: MapLibreMap) => {
      const uncertaintyShorelineFFilter = createDateFilter(['!=', ['get', 'certainty'], 'good'])
      const certaintyShorelineFFilter = createDateFilter(['==', ['get', 'certainty'], 'good'])
      const isShorelineLayerVisible = Boolean(startDate && endDate)

      const shorelineColorExpression: ExpressionSpecification = [
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
      ]

      if (!map.getSource('coastlines')) {
        map.addSource('coastlines', {
          type: 'vector',
          url: 'https://tileserver.prod.digitalearthpacific.io/data/coastlines.json',
        })
      }

      if (!map.getLayer('shorelines-annual-uncertain')) {
        map.addLayer({
          id: 'shorelines-annual-uncertain',
          type: 'line',
          source: 'coastlines',
          'source-layer': 'shorelines_annual',
          minzoom: 13,
          maxzoom: 22,
          filter: uncertaintyShorelineFFilter,
          layout: {
            visibility: isShorelineLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'line-color': shorelineColorExpression,
            'line-width': 2,
            'line-opacity': 0.8,
            'line-dasharray': [4, 4],
          },
        })
      }

      if (!map.getLayer('annual-shorelines')) {
        map.addLayer({
          id: 'annual-shorelines',
          type: 'line',
          source: 'coastlines',
          'source-layer': 'shorelines_annual',
          minzoom: 13,
          maxzoom: 22,
          filter: certaintyShorelineFFilter,
          layout: {
            visibility: isShorelineLayerVisible ? 'visible' : 'none',
          },
          paint: {
            'line-color': shorelineColorExpression,
            'line-width': 2.5,
            'line-opacity': 1,
          },
        })
      }
    },
    [createDateFilter, startDate, endDate],
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

    setIsMapLoaded(true)
  }, [addShorelineChangeLayer, addBuildingsLayer, addMangrovesLayer])

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
        })
      }
    },
    [addBuildingsLayer, addMangrovesLayer, addShorelineChangeLayer],
  )

  const handleBuildingToggle = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const newVisibility = !isBuildingsLayerVisible
    setIsBuildingsLayerVisible(newVisibility)
    map.setLayoutProperty('Buildings', 'visibility', newVisibility ? 'visible' : 'none')
  }, [isBuildingsLayerVisible])

  const handleMangroveToggle = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const newVisibility = !isMangrovesLayerVisible
    setIsMangrovesLayerVisible(newVisibility)
    map.setLayoutProperty('Mangroves', 'visibility', newVisibility ? 'visible' : 'none')
  }, [isMangrovesLayerVisible])

  const handleBaseMapPopupToggle = useCallback(() => {
    setIsBaseMapPopupOpen((prev) => !prev)
  }, [])

  // Handle country selection and map animation
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !selectedCountry) return

    // Check if this is the initial load with a selected country
    if (!shouldAnimate) {
      const mapContainer = mapRef.current.getContainer().parentElement
      if (mapContainer) {
        mapContainer.style.transition = 'none'
        mapRef.current.resize()
        mapContainer.style.transition = ''
        mapRef.current.flyTo(createFlyToOptions('firstSelection'))
        setShouldAnimate(true)
      }
    }
  }, [isMapLoaded, selectedCountry, shouldAnimate, createFlyToOptions])

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return

    // Only handle subsequent selections after the map is loaded
    if (shouldAnimate && selectedCountry) {
      mapRef.current.flyTo(createFlyToOptions('subsequentSelection'))
    }
  }, [selectedCountry, shouldAnimate, createFlyToOptions, isMapLoaded])

  // Reset animation state when no country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setShouldAnimate(false)
    }
  }, [selectedCountry])

  // Update shoreline layers based on date range
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    console.log('startDate ', startDate)
    console.log('endDate ', endDate)
    const isShorelineLayerVisible = Boolean(startDate && endDate)

    if (map.getLayer('shorelines-annual-uncertain')) {
      map.setLayoutProperty(
        'shorelines-annual-uncertain',
        'visibility',
        isShorelineLayerVisible ? 'visible' : 'none',
      )

      if (isShorelineLayerVisible) {
        map.setFilter(
          'shorelines-annual-uncertain',
          createDateFilter(['!=', ['get', 'certainty'], 'good']),
        )
      }
    }

    if (map.getLayer('annual-shorelines')) {
      map.setLayoutProperty(
        'annual-shorelines',
        'visibility',
        isShorelineLayerVisible ? 'visible' : 'none',
      )

      if (isShorelineLayerVisible) {
        map.setFilter('annual-shorelines', createDateFilter(['==', ['get', 'certainty'], 'good']))
      }
    }
  }, [startDate, endDate, createDateFilter])

  return (
    <div
      className={clsx(styles.mapContainer, {
        [styles.withResultPanel]: selectedCountry && !isMobileWidth && !isFullscreen,
        [styles.fullWidth]: !selectedCountry || isMobileWidth || isFullscreen,
      })}
    >
      <Map
        id='main-map'
        ref={mapRef}
        style={MAP_STYLE}
        initialViewState={INITIAL_VIEW_STATE}
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
            <img src={BaseMapIcon} alt='Change basemap or add layers' />
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
