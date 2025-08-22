import { Checkbox, Flex, Text } from '@radix-ui/themes'
import clsx from 'clsx'
import 'maplibre-gl/dist/maplibre-gl.css'

import styles from './BaseMapPopup.module.scss'
import { BASE_MAPS } from '../../library/constants'
import type { MapStyleType } from '../../library/types'

interface BaseMapPopupProps {
  baseMap: MapStyleType
  isBuildingsLayerVisible: boolean
  isMangrovesLayerVisible: boolean
  onBaseMapSelection: (mapKey: MapStyleType) => void
  onBuildingToggle: () => void
  onMangroveToggle: () => void
}

export const BaseMapPopup = ({
  baseMap,
  isBuildingsLayerVisible,
  isMangrovesLayerVisible,
  onBaseMapSelection,
  onBuildingToggle,
  onMangroveToggle,
}: BaseMapPopupProps) => (
  <div className={styles.baseMapPopup}>
    <div className={styles.popupSection}>
      <div className={styles.mapTypeTitle}>Basemaps</div>
      <div className={styles.mapTypeContainer}>
        {BASE_MAPS.map((bm) => (
          <button
            key={bm.key}
            aria-label={`Select ${bm.label} basemap`}
            className={clsx(styles.baseMapButton, {
              [styles.selected]: baseMap === bm.key,
            })}
            onClick={() => onBaseMapSelection(bm.key)}
          >
            <img src={bm.thumbnail} alt={bm.label} />
            <div>{bm.label}</div>
          </button>
        ))}
      </div>
    </div>
    <div className={styles.popupSection}>
      <div className={styles.mapTypeTitle}>Map Layers</div>
      <Flex gap='2' align='center'>
        <Checkbox
          size='2'
          variant='surface'
          className={styles.checkboxButton}
          checked={isBuildingsLayerVisible}
          onCheckedChange={onBuildingToggle}
        />
        <Text size='2'>Buildings</Text>
      </Flex>
      <Flex gap='2' align='center'>
        <Checkbox
          size='2'
          variant='classic'
          className={styles.checkboxButton}
          checked={isMangrovesLayerVisible}
          onCheckedChange={onMangroveToggle}
        />
        <Text size='2'>Mangroves</Text>
      </Flex>
    </div>
  </div>
)
