import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import clsx from 'clsx'
import styles from './MobileResultBottomPanel.module.scss'

import type { PanInfo } from 'framer-motion'
import type { BottomPanelProps } from '../../library/types'

const COLLAPSED_HEIGHT_PERCENT = 0.15
const MINI_COLLAPSED_HEIGHT_PERCENT = 0.05
const EXPANDED_HEIGHT = 0.85

export const MobileResultBottomPanel = ({ open, children }: BottomPanelProps) => {
  const y = useMotionValue(window.innerHeight)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const [isContentAtTop, setIsContentAtTop] = useState(true)
  const [hasOverflowContent, setHasOverflowContent] = useState(false)
  const [allowPanelDrag, setAllowPanelDrag] = useState(false)
  const [currentPanelState, setCurrentPanelState] = useState<
    'expanded' | 'collapsed' | 'mini' | 'hidden'
  >('hidden')

  const touchStateRef = useRef({
    startY: 0,
    startScrollTop: 0,
    isTracking: false,
  })

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight
      setViewportHeight(height)
    }

    const orientationChangeHandler = () => {
      setTimeout(updateViewportHeight, 100)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight)
    } else {
      window.addEventListener('resize', updateViewportHeight)
    }

    if (screen.orientation) {
      screen.orientation.addEventListener('change', orientationChangeHandler)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight)
      } else {
        window.removeEventListener('resize', updateViewportHeight)
      }

      if (screen.orientation) {
        screen.orientation.removeEventListener('change', orientationChangeHandler)
      }
    }
  }, [])

  const getCollapsedPosition = useCallback(() => {
    const collapsedHeight = viewportHeight * COLLAPSED_HEIGHT_PERCENT
    return viewportHeight - collapsedHeight
  }, [viewportHeight])

  const getMiniCollapsedPosition = useCallback(() => {
    const miniHeight = viewportHeight * MINI_COLLAPSED_HEIGHT_PERCENT
    return viewportHeight - miniHeight
  }, [viewportHeight])

  const getExpandedPosition = useCallback(
    () => viewportHeight * (1 - EXPANDED_HEIGHT),
    [viewportHeight],
  )

  const getHiddenPosition = useCallback(() => viewportHeight, [viewportHeight])

  useEffect(() => {
    const unsubscribe = y.on('change', (currentY) => {
      const expandedPos = getExpandedPosition()
      const collapsedPos = getCollapsedPosition()
      const miniCollapsedPos = getMiniCollapsedPosition()
      const hiddenPos = getHiddenPosition()
      const tolerance = 20

      if (Math.abs(currentY - expandedPos) < tolerance) {
        setCurrentPanelState('expanded')
      } else if (Math.abs(currentY - collapsedPos) < tolerance) {
        setCurrentPanelState('collapsed')
      } else if (Math.abs(currentY - miniCollapsedPos) < tolerance) {
        setCurrentPanelState('mini')
      } else if (Math.abs(currentY - hiddenPos) < tolerance) {
        setCurrentPanelState('hidden')
      }
    })

    return unsubscribe
  }, [y, getExpandedPosition, getCollapsedPosition, getMiniCollapsedPosition, getHiddenPosition])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const checkScrollAndOverflow = () => {
      const isAtTop = content.scrollTop === 0
      const hasOverflow = content.scrollHeight > content.clientHeight

      setIsContentAtTop(isAtTop)
      setHasOverflowContent(hasOverflow)
    }

    checkScrollAndOverflow()
    content.addEventListener('scroll', checkScrollAndOverflow, { passive: true })

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStateRef.current = {
        startY: touch.clientY,
        startScrollTop: content.scrollTop,
        isTracking: true,
      }
      setAllowPanelDrag(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStateRef.current.isTracking) return

      const touch = e.touches[0]
      const deltaY = touch.clientY - touchStateRef.current.startY
      const currentScrollTop = content.scrollTop

      const isAtTopAndTryingToScrollUp =
        touchStateRef.current.startScrollTop === 0 && currentScrollTop === 0 && deltaY > 0

      // Reduced threshold for immediate response in expanded state
      const threshold = currentPanelState === 'expanded' ? 3 : 10

      if (isAtTopAndTryingToScrollUp && deltaY > threshold) {
        setAllowPanelDrag(true)
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      touchStateRef.current.isTracking = false
    }

    content.addEventListener('touchstart', handleTouchStart, { passive: true })
    content.addEventListener('touchmove', handleTouchMove, { passive: false })
    content.addEventListener('touchend', handleTouchEnd, { passive: true })

    const resizeObserver = new ResizeObserver(checkScrollAndOverflow)
    resizeObserver.observe(content)

    return () => {
      content.removeEventListener('scroll', checkScrollAndOverflow)
      content.removeEventListener('touchstart', handleTouchStart)
      content.removeEventListener('touchmove', handleTouchMove)
      content.removeEventListener('touchend', handleTouchEnd)
      resizeObserver.disconnect()
    }
  }, [children])

  const animateToPosition = useCallback(
    (position: number) => {
      animate(y, position, {
        type: 'spring',
        stiffness: 600,
        damping: 40,
        duration: 0.4,
      })
    },
    [y],
  )

  useEffect(() => {
    if (open) {
      animateToPosition(getCollapsedPosition())
    } else {
      animateToPosition(getHiddenPosition())
    }
  }, [open, animateToPosition, getCollapsedPosition, getHiddenPosition])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    setAllowPanelDrag(false)

    if (!open) return

    const expandedPos = getExpandedPosition()
    const collapsedPos = getCollapsedPosition()
    const miniCollapsedPos = getMiniCollapsedPosition()
    const currentY = y.get()
    const velocity = info.velocity.y

    let targetPosition: number

    if (Math.abs(velocity) > 800) {
      if (velocity < 0) {
        targetPosition = expandedPos
      } else {
        targetPosition = currentY > collapsedPos ? miniCollapsedPos : collapsedPos
      }
    } else {
      const expandedToCollapsed = collapsedPos - expandedPos
      const collapsedToMini = miniCollapsedPos - collapsedPos
      const expandedThreshold = expandedPos + expandedToCollapsed * 0.3
      const collapsedThreshold = collapsedPos + collapsedToMini * 0.5

      if (currentY <= expandedThreshold) {
        targetPosition = expandedPos
      } else if (currentY <= collapsedThreshold) {
        targetPosition = collapsedPos
      } else {
        targetPosition = miniCollapsedPos
      }
    }

    animate(y, targetPosition, {
      type: 'spring',
      stiffness: 600,
      damping: 45,
      duration: 0.4,
    })
  }

  const handleDragHandleClick = () => {
    if (isDragging) return

    const expandedPos = getExpandedPosition()
    const collapsedPos = getCollapsedPosition()

    let targetPosition: number

    if (currentPanelState === 'expanded') {
      targetPosition = collapsedPos
    } else if (currentPanelState === 'collapsed' || currentPanelState === 'mini') {
      targetPosition = expandedPos
    } else {
      targetPosition = collapsedPos
    }

    animate(y, targetPosition, {
      type: 'spring',
      stiffness: 600,
      damping: 45,
      duration: 0.4,
    })
  }

  const shouldEnablePanelDrag =
    allowPanelDrag ||
    (!hasOverflowContent && isContentAtTop) ||
    currentPanelState === 'collapsed' ||
    currentPanelState === 'mini' ||
    (currentPanelState === 'expanded' && isContentAtTop && hasOverflowContent)

  const shouldDisableContentScroll =
    currentPanelState === 'collapsed' || currentPanelState === 'mini'

  if (!open) return null

  return (
    <motion.div
      ref={panelRef}
      className={clsx(styles.mobileResultBottomContainer)}
      style={{
        y,
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 1000,
        pointerEvents: 'auto',
        touchAction: shouldEnablePanelDrag ? 'pan-y' : 'none',
      }}
      drag='y'
      dragMomentum={false}
      dragElastic={0.3}
      dragConstraints={{
        top: getExpandedPosition() - 50,
        bottom: getMiniCollapsedPosition() + 50,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      dragPropagation={shouldEnablePanelDrag}
    >
      <div className={styles.dragHandleClickArea} onClick={handleDragHandleClick}>
        <div className={styles.dragHandle} />
      </div>
      <div
        ref={contentRef}
        className={styles.content}
        style={{
          pointerEvents: isDragging ? 'none' : 'auto',
          touchAction: shouldDisableContentScroll ? 'none' : 'auto',
          overflowY: shouldDisableContentScroll ? 'hidden' : 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
