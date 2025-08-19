import { useRef, useEffect, useState, useCallback } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { MapRef } from 'react-map-gl/maplibre'
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
import { useCountry } from '../../hooks/useCountry'

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
  return (
    <div className={styles.mapLegend}>
      <div className={styles.legendTitle}>Hot Spots</div>
      <div className={styles.legendSubtitle}>Levels of change</div>
      <div className={styles.legendItems}>
        <div className={styles.legendItem}>
          <div className={clsx(styles.legendCircle, styles.highChange)}></div>
          <span className={styles.legendText}>
            <strong>&gt;5 m</strong> High
          </span>
        </div>
        <div className={styles.legendItem}>
          <div className={clsx(styles.legendCircle, styles.moderateChange)}></div>
          <span className={styles.legendText}>
            <strong>3-5 m</strong> Moderate
          </span>
        </div>
        <div className={styles.legendItem}>
          <div className={clsx(styles.legendCircle, styles.lowChange)}></div>
          <span className={styles.legendText}>
            <strong>2-3 m</strong> Low
          </span>
        </div>
      </div>
    </div>
  )
}

export const MainMap = ({ isFullscreen, onFullscreenToggle, onFullscreenExit }: MainMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const { isMobileWidth } = useResponsive()
  const { selectedCountry } = useCountry()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isBaseMapPopupOpen, setIsBaseMapPopupOpen] = useState(false)
  const [baseMap, setBaseMap] = useState<MapStyleType>('default')
  const [isBuildingsLayerVisible, setIsBuildingsLayerVisible] = useState(true)
  const [isMangrovesLayerVisible, setIsMangrovesLayerVisible] = useState(true)

  // Add a key that changes when screen size changes to force re-render
  const navigationControlKey = `nav-control-${isMobileWidth ? 'mobile' : 'desktop'}`

  const createFlyToOptions = useCallback(
    (preset: keyof typeof FLY_TO_PRESETS) => {
      const defaultFlyToZoom = isMobileWidth ? FLY_TO_MOBILE_ZOOM : FLY_TO_DESKTOP_ZOOM

      return {
        center: selectedCountry?.coordinates as [number, number],
        zoom: defaultFlyToZoom,
        duration: FLY_TO_DURATION,
        ...FLY_TO_PRESETS[preset],
      }
    },
    [selectedCountry, isMobileWidth],
  )

  useEffect(() => {
    if (mapRef.current) {
      const isFirstSelection = !shouldAnimate && selectedCountry

      if (isFirstSelection) {
        // Disable transition temporarily
        const mapContainer = mapRef.current.getContainer().parentElement
        if (mapContainer) {
          mapContainer.style.transition = 'none'

          // Force immediate resize
          mapRef.current.resize()

          // Re-enable transition
          mapContainer.style.transition = ''

          // Smooth flyTo with first selection preset
          mapRef.current.flyTo(createFlyToOptions('firstSelection'))

          setShouldAnimate(true)
        }
      } else {
        // Enhanced flyTo for subsequent selections
        mapRef.current.flyTo(createFlyToOptions('subsequentSelection'))
      }
    }
  }, [selectedCountry, shouldAnimate, createFlyToOptions])

  // Reset animation state when no country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setShouldAnimate(false)
    }
  }, [selectedCountry])

  const addBuildingsLayer = (map: MapLibreMap) => {
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
  }

  const addMangrovesLayer = (map: MapLibreMap) => {
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
  }

  const handleMapLoad = () => {
    const removeNativeTooltips = () => {
      const controls = mapRef.current
        ?.getContainer()
        .querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out')

      controls?.forEach((control) => control.removeAttribute('title'))
    }

    requestAnimationFrame(removeNativeTooltips)

    const map = mapRef.current?.getMap()
    if (!map) return

    addBuildingsLayer(map)
    addMangrovesLayer(map)
  }

  const handleBaseMapPopupToggle = () => {
    setIsBaseMapPopupOpen((prev) => !prev)
  }

  const handleBaseMapSelection = (mapKey: MapStyleType) => {
    setBaseMap(mapKey)
    setIsBaseMapPopupOpen(false)

    // Re-add layers after style change
    const map = mapRef.current?.getMap()
    if (map) {
      map.once('styledata', () => {
        addBuildingsLayer(map)
        addMangrovesLayer(map)
      })
    }
  }

  const handleBuildingToggle = () => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const newVisibility = !isBuildingsLayerVisible
    setIsBuildingsLayerVisible(newVisibility)

    // Toggle layer visibility on the map
    map.setLayoutProperty('Buildings', 'visibility', newVisibility ? 'visible' : 'none')
  }

  const handleMangroveToggle = () => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const newVisibility = !isMangrovesLayerVisible
    setIsMangrovesLayerVisible(newVisibility)

    // Toggle layer visibility on the map
    map.setLayoutProperty('Mangroves', 'visibility', newVisibility ? 'visible' : 'none')
  }

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
          <IconButton onClick={handleBaseMapPopupToggle} aria-label='Change base map or add layers'>
            <img src={BaseMapIcon} alt='Change base map or add layers' />
          </IconButton>
        </Tooltip>

        {isBaseMapPopupOpen && (
          <div className={styles.baseMapPopup}>
            <div className={styles.mapTypeTitle}>Base Maps</div>
            <div className={styles.mapTypeContainer}>
              {BASE_MAPS.map((bm) => (
                <button
                  key={bm.key}
                  aria-label={`Select ${bm.label} base map`}
                  className={baseMap === bm.key ? styles.selected : ''}
                  onClick={() => handleBaseMapSelection(bm.key)}
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
                onCheckedChange={handleBuildingToggle}
              />{' '}
              <Text size='2'>Buildings</Text>
            </Flex>
            <Flex gap='2' align='center'>
              <Checkbox
                size='2'
                variant='surface'
                checked={isMangrovesLayerVisible}
                onCheckedChange={handleMangroveToggle}
              />{' '}
              <Text size='2'>Mangroves</Text>
            </Flex>
          </div>
        )}
      </div>
    </div>
  )
}
