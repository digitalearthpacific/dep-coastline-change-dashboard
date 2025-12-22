import { Flex, Text } from '@radix-ui/themes'
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import LowQualityShorelineIcon from '../../assets/low-quality-shoreline.svg'
import {
  RETREAT_LEGEND_ITEMS,
  GROWTH_LEGEND_ITEMS,
  DENSITY_LEGEND_ITEMS,
  BUILDINGS_LEGEND_ITEMS,
} from '../../library/constants'
import styles from './MapLegend.module.scss'

interface MapLegendProps {
  isExpanded: boolean
  onToggle: () => void
}

interface LegendCategoryProps {
  title: string
  items: Array<{
    key: string
    label: string
    boldLabel?: string
    extraStyleClass: string
  }>
}

const HotspotsLegendSection = () => (
  <Flex direction='column'>
    <Text size='1' weight='bold'>
      Hotspots
    </Text>
    <Text size='1'>Levels of change</Text>
  </Flex>
)

const LegendCategory = ({ title, items }: LegendCategoryProps) => (
  <>
    {title && (
      <Text size='1' weight='bold'>
        {title}
      </Text>
    )}
    <Flex
      direction='column'
      gap='1'
      style={{
        borderBottom: '1px solid var(--gray-6, #d9d9d9)',
        paddingBottom: 'var(--space-2, 8px)',
      }}
    >
      {items.map(({ key, label, extraStyleClass, boldLabel }) => (
        <Flex key={key} gap='2' align='center'>
          <div className={clsx(styles.legendCircle, styles[extraStyleClass])} />
          <Text size='1'>
            {boldLabel && (
              <Text weight='bold' as='span'>
                {boldLabel}{' '}
              </Text>
            )}
            <Text as='span'>{label}</Text>
          </Text>
        </Flex>
      ))}
    </Flex>
  </>
)

const CoastlinesLegendSection = () => (
  <>
    <Flex direction='column'>
      <Text size='1' weight='bold'>
        Coastlines
      </Text>
      <Text size='1'>Dashed coastlines indicate low quality data</Text>
    </Flex>
    <Flex align='center' gap='2'>
      <img src={LowQualityShorelineIcon} alt='Dashed line' />
      <Text size='1'>Low Quality</Text>
    </Flex>
  </>
)

export const MapLegend = ({ isExpanded, onToggle }: MapLegendProps) => {
  return (
    <div className={styles.mapLegendContainer}>
      <Flex direction='column' gap='2'>
        <Flex align='center' justify='between' onClick={onToggle} style={{ cursor: 'pointer' }}>
          <Text size='2' weight='bold'>
            Legend
          </Text>
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Flex>

        {isExpanded && (
          <>
            <HotspotsLegendSection />
            <LegendCategory title='Retreat' items={RETREAT_LEGEND_ITEMS} />
            <LegendCategory title='Growth' items={GROWTH_LEGEND_ITEMS} />
            <LegendCategory title='Mangroves' items={DENSITY_LEGEND_ITEMS} />
            <LegendCategory title='' items={BUILDINGS_LEGEND_ITEMS} />
            <CoastlinesLegendSection />
          </>
        )}
      </Flex>
    </div>
  )
}
