import React from 'react'
import { Button } from '@radix-ui/themes'
import styles from './TextButton.module.scss'

export type TextButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export const TextButton = ({
  children,
  onClick,
  disabled = false,
  ariaLabel = '',
  className = '',
}: TextButtonProps) => (
  <Button
    variant='ghost'
    color='gray'
    radius='full'
    type='button'
    onClick={onClick}
    disabled={disabled}
    className={`${styles.textButton} ${className}`}
    highContrast={false}
    aria-label={ariaLabel}
  >
    {children}
  </Button>
)

export default TextButton
