import type { IconType } from '../library/types'

export const PolygonDrawIcon = ({ color = 'currentColor', className = '' }: IconType) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='23'
    height='23'
    viewBox='0 0 23 23'
    fill='none'
  >
    <g clipPath='url(#clip0_3546_1941)'>
      <path
        d='M10.3709 4.71404L4.71405 10.3709C4.1955 10.8894 4.1955 11.738 4.71405 12.2565L10.3709 17.9134C10.8894 18.4319 11.738 18.4319 12.2565 17.9134L17.9134 12.2565C18.4319 11.738 18.4319 10.8894 17.9134 10.3709L12.2565 4.71404C11.738 4.1955 10.8894 4.1955 10.3709 4.71404ZM16.4992 11.7851L11.7851 16.4992C11.5258 16.7584 11.1016 16.7584 10.8423 16.4992L6.12826 11.7851C5.86899 11.5258 5.86899 11.1016 6.12826 10.8423L10.8423 6.12826C11.1016 5.86899 11.5258 5.86899 11.7851 6.12826L16.4992 10.8423C16.7584 11.1016 16.7584 11.5258 16.4992 11.7851Z'
        fill={color}
      />
    </g>
    <defs>
      <clipPath id='clip0_3546_1941'>
        <rect width='16' height='16' fill='white' transform='translate(0 11.3137) rotate(-45)' />
      </clipPath>
    </defs>
  </svg>
)

export default PolygonDrawIcon
