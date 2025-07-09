import { useRef } from 'react'
import Map, { AttributionControl, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { StackIcon, EnterFullScreenIcon } from '@radix-ui/react-icons'
import { Tooltip } from '@radix-ui/themes'
import styles from './MainMap.module.scss'

// Constants
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
  marginBottom: '5rem',
}

export const MainMap = () => {
  const mapRef = useRef<MapRef>(null)

  const handleMapLoad = () => {
    // Remove native tooltips after map loads
    const removeNativeTooltips = () => {
      const controls = document.querySelectorAll(
        '.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out',
      )
      controls.forEach((control) => control.removeAttribute('title'))
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

  const handleBasemapChange = () => {
    // TODO: Implement basemap switching functionality
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        id="main-map"
        ref={mapRef}
        style={MAP_STYLE}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.COASTLINE_APP_MAP_TILER_API_KEY}`}
        onLoad={handleMapLoad}
        attributionControl={false}
      >
        <AttributionControl position="bottom-left" compact={true} />
        <NavigationControl
          position="bottom-right"
          showCompass={false}
          style={NAVIGATION_CONTROL_STYLE}
        />
      </Map>

      <Tooltip content="Fullscreen" side="left">
        <button
          className={styles.fullScreenIconButton}
          onClick={handleFullscreen}
          aria-label="Toggle Fullscreen"
          type="button"
        >
          <EnterFullScreenIcon />
        </button>
      </Tooltip>

      <Tooltip content="Basemap" side="left">
        <button
          className={styles.stackIconButton}
          onClick={handleBasemapChange}
          aria-label="Change Basemap"
          type="button"
        >
          <StackIcon />
        </button>
      </Tooltip>
    </div>
  )
}
