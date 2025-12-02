import type { IconType } from '../library/types'

export const DrawIcon = ({ color = 'currentColor', className = '' }: IconType) => (
  <svg
    className={className}
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M13.8066 3.75354L12.2466 2.19354C11.9866 1.93354 11.5666 1.93354 11.3066 2.19354L10.0866 3.41354L12.5866 5.91354L13.8066 4.69354C14.0666 4.43354 14.0666 4.01354 13.8066 3.75354Z'
      fill={color}
    />
    <path
      d='M2 11.6395V13.6661C2 13.8528 2.14667 13.9995 2.33333 13.9995H4.36C4.44667 13.9995 4.53333 13.9661 4.59333 13.8995L11.8733 6.62614L9.37333 4.12614L2.1 11.3995C2.03333 11.4661 2 11.5461 2 11.6395Z'
      fill={color}
    />
  </svg>
)

export default DrawIcon
