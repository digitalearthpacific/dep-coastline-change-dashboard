import { useState, useEffect } from 'react'
import { DEFAULT_MOBILE_WIDTH_THRESHOLD } from '../constants'
import type { ResponsiveState } from '../types'

const useResponsive = (): ResponsiveState => {
  const isClient = typeof window !== 'undefined'

  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(() => {
    return isClient ? window.innerWidth <= DEFAULT_MOBILE_WIDTH_THRESHOLD : false
  })

  useEffect(() => {
    if (!isClient) return

    const handleResize = (): void => {
      const width = window.innerWidth

      setIsMobileWidth(width <= DEFAULT_MOBILE_WIDTH_THRESHOLD)
    }

    window.addEventListener('resize', handleResize)

    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobileWidth }
}

export default useResponsive
