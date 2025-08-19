// Component prop types
export type MainMapProps = {
  isFullscreen: boolean
  onFullscreenToggle: () => void
  onFullscreenExit: () => void
}

export type BottomPanelProps = {
  open: boolean
  onClose?: () => void
  children?: React.ReactNode
}
