{
  /* Drawing is not fully supported on touch devices
    See: https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md#touch-device-support */
}
import clsx from 'clsx'
import { IconButton, Tooltip } from '@radix-ui/themes'
import { PolygonDrawIcon } from '../../assets/PolygonDrawIcon'
import { SquareDrawIcon } from '../../assets/SquareDrawIcon'
import { CircleDrawIcon } from '../../assets/CircleDrawIcon'
import { DeleteDrawIcon } from '../../assets/DeleteDrawIcon'
import styles from './MapDrawPopup.module.scss'

type MapDrawPopupProps = {
  activeDrawMode: 'polygon' | 'rectangle' | 'circle' | null
  onPolygonDraw: () => void
  onRectangleDraw: () => void
  onCircleDraw: () => void
  onDeleteDraw: () => void
}

export const MapDrawPopup = ({
  activeDrawMode,
  onPolygonDraw,
  onRectangleDraw,
  onCircleDraw,
  onDeleteDraw,
}: MapDrawPopupProps) => {
  return (
    <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
      <Tooltip content='Polygon'>
        <IconButton onClick={onPolygonDraw} aria-label='Polygon'>
          <PolygonDrawIcon className={clsx(activeDrawMode === 'polygon' && styles.activeButton)} />
        </IconButton>
      </Tooltip>
      <Tooltip content='Rectangle'>
        <IconButton onClick={onRectangleDraw} radius='none' aria-label='Rectangle'>
          <SquareDrawIcon className={clsx(activeDrawMode === 'rectangle' && styles.activeButton)} />
        </IconButton>
      </Tooltip>

      <Tooltip content='Circle'>
        <IconButton onClick={onCircleDraw} radius='none' aria-label='Circle'>
          <CircleDrawIcon className={clsx(activeDrawMode === 'circle' && styles.activeButton)} />
        </IconButton>
      </Tooltip>
      <Tooltip content='Delete'>
        <IconButton onClick={onDeleteDraw} aria-label='Delete'>
          <DeleteDrawIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}
