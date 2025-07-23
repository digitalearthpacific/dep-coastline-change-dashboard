import { useRef, useEffect, useState, useCallback } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import { IconButton, Tooltip } from '@radix-ui/themes'
import 'maplibre-gl/dist/maplibre-gl.css'

import styles from './MainMap.module.scss'
import BaseMapIcon from '../../assets/basemap.svg'
import EnterFullScreenIcon from '../../assets/fullscreen.svg'
import {
  INITIAL_VIEW_STATE,
  FLY_TO_DESKTOP_ZOOM,
  FLY_TO_MOBILE_ZOOM,
  FLY_TO_DURATION,
  FLY_TO_PRESETS,
  BASE_MAPS,
} from '../../library/constants'
import type { MainMapProps, MapStyleType } from '../../library/types'
import useResponsive from '../../library/hooks/useResponsive'
import clsx from 'clsx'

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

export const MainMap = ({ flyToLocation, selectedCountry }: MainMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const { isMobileWidth } = useResponsive()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isBaseMapPopupOpen, setIsBaseMapPopupOpen] = useState(false)
  const [baseMap, setBaseMap] = useState<MapStyleType>('default')

  // Add a key that changes when screen size changes to force re-render
  const navigationControlKey = `nav-control-${isMobileWidth ? 'mobile' : 'desktop'}`

  const createFlyToOptions = useCallback(
    (preset: keyof typeof FLY_TO_PRESETS) => {
      const defaultFlyToZoom = isMobileWidth ? FLY_TO_MOBILE_ZOOM : FLY_TO_DESKTOP_ZOOM

      return {
        center: flyToLocation!.center as [number, number],
        zoom: flyToLocation!.zoom ?? defaultFlyToZoom,
        duration: flyToLocation!.duration ?? FLY_TO_DURATION,
        ...FLY_TO_PRESETS[preset],
      }
    },
    [flyToLocation, isMobileWidth],
  )

  useEffect(() => {
    if (flyToLocation && mapRef.current) {
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
  }, [flyToLocation, selectedCountry, isMobileWidth, shouldAnimate, createFlyToOptions])

  // Reset animation state when no country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setShouldAnimate(false)
    }
  }, [selectedCountry])

  const handleMapLoad = () => {
    const removeNativeTooltips = () => {
      const controls = mapRef.current
        ?.getContainer()
        .querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out')

      controls?.forEach((control) => control.removeAttribute('title'))
    }

    requestAnimationFrame(removeNativeTooltips)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleBaseMapChange = () => {
    setIsBaseMapPopupOpen((prev) => !prev)
  }

  return (
    <div
      className={clsx(styles.mapContainer, {
        [styles.withPanel]: selectedCountry && !isMobileWidth,
        [styles.fullWidth]: !selectedCountry || isMobileWidth,
        [styles.withBottomSheet]: isMobileWidth && selectedCountry,
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
          key={navigationControlKey} // This forces re-render when screen size changes
          position={isMobileWidth ? 'top-right' : 'bottom-right'}
          showCompass={false}
          style={NAVIGATION_CONTROL_STYLE}
        />
      </Map>

      <div className={styles.customMapTools}>
        <Tooltip content='Fullscreen' side='left'>
          <IconButton
            onClick={handleFullscreen}
            aria-label='Toggle Fullscreen'
            className={styles.customMapToolIconButton}
          >
            <img src={EnterFullScreenIcon} alt='Toggle fullscreen' />
          </IconButton>
        </Tooltip>
        <Tooltip content='Base Map' side='left'>
          <IconButton
            onClick={handleBaseMapChange}
            aria-label='Change Base Map'
            className={styles.customMapToolIconButton}
          >
            <img src={BaseMapIcon} alt='Change base map' />
          </IconButton>
        </Tooltip>
        {isBaseMapPopupOpen && (
          <div className={styles.baseMapPopup}>
            {BASE_MAPS.map((bm) => (
              <button
                key={bm.key}
                aria-label={`Select ${bm.label} base map`}
                className={baseMap === bm.key ? styles.selected : ''}
                onClick={() => {
                  setBaseMap(bm.key)
                  setIsBaseMapPopupOpen(false)
                }}
              >
                <img src={bm.thumbnail} alt={bm.label} />
                <div>{bm.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
