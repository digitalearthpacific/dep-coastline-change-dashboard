import { useRef, useEffect } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import { IconButton, Tooltip } from '@radix-ui/themes'
import 'maplibre-gl/dist/maplibre-gl.css'

import styles from './MainMap.module.scss'
import BaseMapIcon from '../../assets/basemap.svg'
import EnterFullScreenIcon from '../../assets/fullscreen.svg'
import { INITIAL_VIEW_STATE, FLY_TO_ZOOM, FLY_TO_DURATION } from '../../library/constants'
import type { MainMapProps } from '../../library/types'

const MAP_STYLE = {
  width: '100%',
  height: '100%',
}

const NAVIGATION_CONTROL_STYLE = {
  marginBottom: 'var(--navigation-control-margin-bottom, 106px)',
  marginRight: 'var(--navigation-control-margin-right, 24px)',
}

export const MainMap = ({ flyToLocation }: MainMapProps) => {
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (flyToLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: flyToLocation.center as [number, number],
        zoom: flyToLocation.zoom ?? FLY_TO_ZOOM,
        duration: flyToLocation.duration ?? FLY_TO_DURATION,
      })
    }
  }, [flyToLocation])

  const handleMapLoad = () => {
    // Remove native tooltips after map loads
    const removeNativeTooltips = () => {
      const controls = mapRef.current
        ?.getContainer()
        .querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out')

      controls?.forEach((control) => control.removeAttribute('title'))
    }

    requestAnimationFrame(removeNativeTooltips)
  }

  const handleFullscreen = () => {
    // TODO: This is a basic full screen, Will implement fullscreen toggle full functionality
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleBaseMapChange = () => {
    // TODO: Implement base map switching functionality
  }

  return (
    <>
      <Map
        id='main-map'
        ref={mapRef}
        style={MAP_STYLE}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.COASTLINE_APP_MAP_TILER_API_KEY}`}
        onLoad={handleMapLoad}
        attributionControl={false}
      >
        <AttributionControl position='bottom-left' compact={true} />
        <NavigationControl
          position='bottom-right'
          showCompass={false}
          style={NAVIGATION_CONTROL_STYLE}
        />
      </Map>

      <div className={styles.customMapTools}>
        <Tooltip content='Fullscreen' side='left'>
          <IconButton
            size='2'
            variant='solid'
            onClick={handleFullscreen}
            aria-label='Toggle Fullscreen'
            className={styles.customMapToolIconButton}
          >
            <img src={EnterFullScreenIcon} alt='Toggle fullscreen' />
          </IconButton>
        </Tooltip>
        <Tooltip content='Base Map' side='left'>
          <IconButton
            size='2'
            variant='solid'
            onClick={handleBaseMapChange}
            aria-label='Change Base Map'
            className={styles.customMapToolIconButton}
          >
            <img src={BaseMapIcon} alt='Change base map' />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
