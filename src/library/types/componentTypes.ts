import type { ContiguousHotspotProperties } from './countryGeoJsonTypes'

// Component prop types
export type MainMapProps = {
  isFullscreen: boolean
  onFullscreenToggle: () => void
  onFullscreenExit: () => void
  selectedHotspotData: ContiguousHotspotProperties | null
  handleHotspotDataChange: (hotspotData: ContiguousHotspotProperties | null) => void
}

export type BottomPanelProps = {
  open: boolean
  onClose?: () => void
  children?: React.ReactNode
}
