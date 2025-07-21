import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import clsx from 'clsx'
import styles from './MobileResultBottomPanel.module.scss'

import type { PanInfo } from 'framer-motion'
import type { BottomPanelProps } from '../../library/types'

// Use percentage-based heights for better mobile compatibility
const COLLAPSED_HEIGHT_PERCENT = 0.15 // 15% of actual viewport height
const MINI_COLLAPSED_HEIGHT_PERCENT = 0.05 // 5% of actual viewport height
const EXPANDED_HEIGHT = 0.85 // 85% of viewport height

export const MobileResultBottomPanel = ({ open, children }: BottomPanelProps) => {
  const y = useMotionValue(window.innerHeight)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  // Track real viewport changes for mobile browsers
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visualViewport API for more accurate mobile measurements
      const height = window.visualViewport?.height || window.innerHeight
      setViewportHeight(height)
    }

    const orientationChangeHandler = () => {
      setTimeout(updateViewportHeight, 100)
    }

    // Listen for viewport changes (handles mobile browser UI)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight)
    } else {
      window.addEventListener('resize', updateViewportHeight)
    }

    // Also listen for orientation changes
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

  // Calculate positions using actual viewport height
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

  const animateToPosition = useCallback(
    (position: number) => {
      animate(y, position, {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      })
    },
    [y],
  )

  // Animate in/out when open state changes
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

  // Handle drag end - determine final position based on distance and velocity
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    if (!open) return

    const expandedPos = getExpandedPosition()
    const collapsedPos = getCollapsedPosition()
    const miniCollapsedPos = getMiniCollapsedPosition()
    const currentY = y.get()
    const velocity = info.velocity.y

    let targetPosition: number

    // High velocity override - fast gestures snap based on direction
    if (Math.abs(velocity) > 800) {
      if (velocity < 0) {
        // Dragging up fast - go to expanded
        targetPosition = expandedPos
      } else {
        // Dragging down fast - determine between collapsed and mini-collapsed
        if (currentY > collapsedPos) {
          targetPosition = miniCollapsedPos
        } else {
          targetPosition = collapsedPos
        }
      }
    } else {
      // Distance-based logic for slow/medium gestures
      const expandedToCollapsed = collapsedPos - expandedPos
      const collapsedToMini = miniCollapsedPos - collapsedPos

      // Create three zones with thresholds
      const expandedThreshold = expandedPos + expandedToCollapsed * 0.3
      const collapsedThreshold = collapsedPos + collapsedToMini * 0.5

      if (currentY <= expandedThreshold) {
        // Upper zone - snap to expanded
        targetPosition = expandedPos
      } else if (currentY <= collapsedThreshold) {
        // Middle zone - snap to normal collapsed
        targetPosition = collapsedPos
      } else {
        // Lower zone - snap to mini collapsed
        targetPosition = miniCollapsedPos
      }
    }

    animate(y, targetPosition, {
      type: 'spring',
      stiffness: 400,
      damping: 35,
    })
  }

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
    >
      <div className={styles.dragHandle} />
      <div
        ref={contentRef}
        className={styles.content}
        style={{
          pointerEvents: isDragging ? 'none' : 'auto',
        }}
        onTouchStart={(e) => {
          const target = e.target as HTMLElement
          if (!target.closest(`.${styles.dragHandle}`)) {
            e.stopPropagation()
          }
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
