import { useRef } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { EnterFullScreenIcon } from '@radix-ui/react-icons'
import { IconButton, Tooltip } from '@radix-ui/themes'
import styles from './MainMap.module.scss'
import BaseMapIcon from '../../assets/basemap.svg'

const INITIAL_VIEW_STATE = {
  longitude: 160,
  latitude: -10,
  zoom: 4,
}

const MAP_STYLE = {
  width: '100%',
  height: '100vh',
}

const NAVIGATION_CONTROL_STYLE = {
  marginBottom: '106px',
  marginRight: '24px',
}

export const MainMap = () => {
  const mapRef = useRef<MapRef>(null)

  const handleMapLoad = () => {
    // Remove native tooltips after map loads
    const removeNativeTooltips = () => {
      const controls = mapRef.current
        ?.getContainer()
        .querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out')

      controls?.forEach((control) => control.removeAttribute('title'))
    }

    // Use requestAnimationFrame for next paint cycle
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
    // TODO: Implement basemap switching functionality
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
            <EnterFullScreenIcon />
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
            <img src={BaseMapIcon} alt='Basemap' />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
