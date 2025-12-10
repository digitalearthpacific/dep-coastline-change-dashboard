import { Flex, Radio, Text } from '@radix-ui/themes'
import { useMapVisualization, useMapData } from '../../hooks/useGlobalContext'
import { CustomPopover } from '../CustomPopover'
import commonStay from '../../styles/common.module.scss'
import styles from './HotSpotsCard.module.scss'

export const HotSpotsCard = () => {
  const { selectedCountryFeature } = useMapData()
  const { hotspotRadio, onRadioStateChange } = useMapVisualization()
  const shorelineChangeMagnitude = selectedCountryFeature?.properties?.shoreline_change_magnitude

  const renderExportRadioIndicator = (isChecked: boolean) => (
    <span
      className={`export-only ${styles.exportRadioIndicator}${
        isChecked ? ` ${styles.exportRadioIndicatorChecked}` : ''
      }`}
      aria-hidden='true'
    />
  )

  return (
    <div className={commonStay.appCard}>
      <Flex direction='column' gap='3'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Hotspots
            </Text>
            <CustomPopover
              ariaLabel='Information about coastal change hotspots'
              content={
                'The total length of coastline within the country experiencing either retreat or growth at various rates. Some distances may appear smaller than expected where hotspot buffers overlap areas with less significant change.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Identifies coastal areas experiencing high levels of change
          </Text>
        </Flex>
        <Flex direction='column'>
          <Flex
            justify='between'
            align='center'
            style={{ borderBottom: '1px solid var(--gray-6)', paddingBottom: 'var(--space-1)' }}
          >
            <Flex align='center' gap='2'>
              {renderExportRadioIndicator(hotspotRadio === 'high')}
              <Radio
                name='hotspotRadio'
                value='high'
                checked={hotspotRadio === 'high'}
                onClick={() => onRadioStateChange('high')}
                element-hide-export='true'
              />
              <Text size='4' weight='bold'>
                {Math.round(Number(shorelineChangeMagnitude?.high_change_km)).toLocaleString() ??
                  '-'}{' '}
                km
              </Text>
              <Text size='3' color='gray'>
                High Change (&gt;5 m per year)
              </Text>
            </Flex>
          </Flex>
          <Flex
            justify='between'
            align='center'
            style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
          >
            <Flex align='center' gap='2'>
              {renderExportRadioIndicator(hotspotRadio === 'moderate')}
              <Radio
                name='hotspotRadio'
                value='moderate'
                checked={hotspotRadio === 'moderate'}
                onClick={() => onRadioStateChange('moderate')}
                element-hide-export='true'
              />
              <Text size='4' weight='bold'>
                {Math.round(Number(shorelineChangeMagnitude?.medium_change_km)).toLocaleString() ??
                  '-'}{' '}
                km
              </Text>
              <Text size='3' color='gray'>
                Moderate Change (&gt;3 m per year)
              </Text>
            </Flex>
          </Flex>
          <Flex justify='between' align='center' style={{ paddingTop: 'var(--space-1)' }}>
            <Flex align='center' gap='2'>
              {renderExportRadioIndicator(hotspotRadio === 'low')}
              <Radio
                name='hotspotRadio'
                value='low'
                checked={hotspotRadio === 'low'}
                onClick={() => onRadioStateChange('low')}
                element-hide-export='true'
              />
              <Text size='4' weight='bold'>
                {Math.round(Number(shorelineChangeMagnitude?.low_change_km)).toLocaleString() ??
                  '-'}{' '}
                km
              </Text>
              <Text size='3' color='gray'>
                Low Change (&gt;2 m per year)
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}
