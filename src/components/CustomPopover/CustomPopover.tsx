import * as Popover from '@radix-ui/react-popover'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import styles from './CustomPopover.module.scss'

export const CustomPopover = ({
  ariaLabel,
  content,
  side = 'left',
}: {
  ariaLabel: string
  content: string
  side?: 'left' | 'right' | 'top' | 'bottom'
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <InfoCircledIcon className={styles.iconStyle} aria-label={ariaLabel} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align='center'
          sideOffset={4}
          className={styles.popoverContent}
        >
          {content}
          <Popover.Arrow className={styles.popoverArrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
