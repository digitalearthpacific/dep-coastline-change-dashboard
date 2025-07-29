type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

export function requestFullscreen(element: HTMLElement | null) {
  if (!element) return

  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as FullscreenElement).webkitRequestFullscreen) {
    ;(element as FullscreenElement).webkitRequestFullscreen!()
  } else if ((element as FullscreenElement).msRequestFullscreen) {
    ;(element as FullscreenElement).msRequestFullscreen!()
  }
}
