import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import clsx from 'clsx'
import styles from './MobileResultBottomPanel.module.scss'

import type { PanInfo } from 'framer-motion'
import type { BottomPanelProps } from '../../library/types'

// Fixed height for collapsed state, percentage for expanded
const COLLAPSED_HEIGHT_PX = 140 // Fixed 140px from bottom
const EXPANDED_HEIGHT = 0.85 // 85vh from bottom (expanded state)

export const MobileResultBottomPanel = ({ open, children }: BottomPanelProps) => {
  const y = useMotionValue(window.innerHeight) // initially off-screen
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate positions - fixed height for collapsed, viewport-based for expanded
  const getCollapsedPosition = () => window.innerHeight - COLLAPSED_HEIGHT_PX
  const getExpandedPosition = () => window.innerHeight * (1 - EXPANDED_HEIGHT)
  const getHiddenPosition = () => window.innerHeight

  // Animate in/out when open state changes
  useEffect(() => {
    if (open) {
      // Animate to fixed collapsed position when opening
      animate(y, getCollapsedPosition(), {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      })
    } else {
      // Animate completely off-screen when closing
      animate(y, getHiddenPosition(), {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      })
    }
  }, [open, y])

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true)
  }

  // Handle drag end - determine final position based on distance and velocity
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    if (!open) return

    const collapsedPos = getCollapsedPosition()
    const expandedPos = getExpandedPosition()
    const currentY = y.get()
    const velocity = info.velocity.y

    let targetPosition: number

    // High velocity override - fast gestures snap based on direction
    if (Math.abs(velocity) > 800) {
      targetPosition = velocity > 0 ? collapsedPos : expandedPos
    } else {
      // Distance-based logic for slow/medium gestures
      const totalRange = collapsedPos - expandedPos
      const halfwayPoint = expandedPos + totalRange / 2

      if (currentY <= halfwayPoint) {
        // Closer to expanded position - snap to expanded
        targetPosition = expandedPos
      } else {
        // Closer to collapsed position - snap to collapsed
        targetPosition = collapsedPos
      }
    }

    animate(y, targetPosition, {
      type: 'spring',
      stiffness: 400,
      damping: 35,
    })
  }

  // Don't render if not open
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
        bottom: getCollapsedPosition() + 50,
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
          // Disable drag when scrolling content
          pointerEvents: isDragging ? 'none' : 'auto',
        }}
        onTouchStart={(e) => {
          // Only allow dragging from drag handle area
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
