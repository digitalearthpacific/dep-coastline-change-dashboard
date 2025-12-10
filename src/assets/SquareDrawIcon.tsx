import type { IconType } from '../library/types'

export const SquareDrawIcon = ({ color = 'currentColor', className = '' }: IconType) => (
  <svg
    className={className}
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12.6667 3.3335H3.33333C2.6 3.3335 2 3.9335 2 4.66683V11.3335C2 12.0668 2.6 12.6668 3.33333 12.6668H12.6667C13.4 12.6668 14 12.0668 14 11.3335V4.66683C14 3.9335 13.4 3.3335 12.6667 3.3335ZM12 11.3335H4C3.63333 11.3335 3.33333 11.0335 3.33333 10.6668V5.3335C3.33333 4.96683 3.63333 4.66683 4 4.66683H12C12.3667 4.66683 12.6667 4.96683 12.6667 5.3335V10.6668C12.6667 11.0335 12.3667 11.3335 12 11.3335Z'
      fill={color}
    />
  </svg>
)

export default SquareDrawIcon
