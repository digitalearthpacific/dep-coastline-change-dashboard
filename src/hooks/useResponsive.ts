import { useState, useEffect } from 'react'
import { MOBILE_WIDTH_THRESHOLD, SMALL_DESKTOP_WIDTH_THRESHOLD } from '../library/constants'
import type { ResponsiveState } from '../library/types'

const useResponsive = (): ResponsiveState => {
  const isClient = typeof window !== 'undefined'

  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(() => {
    return isClient ? window.innerWidth <= MOBILE_WIDTH_THRESHOLD : false
  })

  const [isSmallerDesktopWidth, setIsSmallerDesktopWidth] = useState<boolean>(() => {
    return isClient ? window.innerWidth <= SMALL_DESKTOP_WIDTH_THRESHOLD : false
  })

  useEffect(() => {
    if (!isClient) return

    const handleResize = (): void => {
      const width = window.innerWidth

      setIsMobileWidth(width <= MOBILE_WIDTH_THRESHOLD)
      setIsSmallerDesktopWidth(width <= SMALL_DESKTOP_WIDTH_THRESHOLD)
    }

    window.addEventListener('resize', handleResize)

    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobileWidth, isSmallerDesktopWidth }
}

export default useResponsive
