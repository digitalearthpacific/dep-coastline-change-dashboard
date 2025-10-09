import { Flex } from '@radix-ui/themes'
import 'maplibre-gl/dist/maplibre-gl.css'

import styles from './DateRangePopup.module.scss'
import { DateRangeSelect } from '../DateRangeSelect/DateRangeSelect'

export const DateRangePopup = () => (
  <div className={styles.popupContainer}>
    <Flex gap='2' direction='column'>
      <DateRangeSelect />
    </Flex>
  </div>
)
