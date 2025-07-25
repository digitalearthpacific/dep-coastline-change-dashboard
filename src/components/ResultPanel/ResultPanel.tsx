import { Card, Flex, Text } from '@radix-ui/themes'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import InfoCircledIcon from '../../assets/info-circled.svg'
import useResponsive from '../../library/hooks/useResponsive'
import type { PacificCountry, ResultPanelProps } from '../../library/types'
import styles from './Result.module.scss'

const CountryInfoCard = ({ selectedCountry }: { selectedCountry: PacificCountry | null }) => {
  const { isMobileWidth } = useResponsive()

  return (
    <Card>
      <Flex direction='column' gap='2' justify='between'>
        <Flex justify='between' align='start'>
          {isMobileWidth ? (
            <Flex direction='column' gap='1'>
              <Text as='div' size='6' weight='bold'>
                Coastline Change:
              </Text>
              <Text as='div' size='6' weight='bold'>
                {selectedCountry?.name}
              </Text>
            </Flex>
          ) : (
            <Text as='div' size='7' weight='bold'>
              Coastline Change: {selectedCountry?.name}
            </Text>
          )}
          <img src={InfoCircledIcon} alt='Information about coastline change' />
        </Flex>
        <Flex>
          <Text as='div' size={isMobileWidth ? '2' : '3'} color='gray'>
            Estimated coastline change from 2000 to 2020
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}

const ErrorCard = () => (
  <div style={{ padding: '16px' }}>
    <Card className={styles.errorCard} variant='ghost'>
      <Flex align='center' gap='1'>
        <div className={styles.errorIcon} role='img' aria-label='Error information' />
        <Text as='div' size='2'>
          Unable to load data, please try again.
        </Text>
      </Flex>
    </Card>
  </div>
)

export const ResultPanel = ({ selectedCountry, isMobilePanelOpen }: ResultPanelProps) => {
  const { isMobileWidth } = useResponsive()
  const isErrorCountry = selectedCountry?.name === 'Error Country'

  if (!selectedCountry) return null

  const content = isErrorCountry ? (
    <ErrorCard />
  ) : (
    <CountryInfoCard selectedCountry={selectedCountry} />
  )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
