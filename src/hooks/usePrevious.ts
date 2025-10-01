import { useEffect, useRef } from 'react'

/**
 * Custom hook to track the previous value of a variable
 * @param value - The current value to track
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
