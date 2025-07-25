import { Card, Flex, Grid, Text } from '@radix-ui/themes'

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
          <img src={InfoCircledIcon} alt='Information about location' />
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

const ShorelineChangeCard = () => (
  <Card className={styles.shorelineChangeCard}>
    <Flex direction='column'>
      <Flex justify='between' align='start'>
        <Text as='div' size='4' weight='bold'>
          Shoreline Change
        </Text>
        <img src={InfoCircledIcon} alt='Information about shoreline change' />
      </Flex>
      <Text as='div' size='2' color='gray' style={{ marginBottom: '12px' }}>
        The average annual rate of shoreline change
      </Text>
      <Flex direction='column' gap='1'>
        <Flex style={{ borderBottom: '1px solid var(--gray-6)' }}>
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            -%
          </Text>
          <Text size='3' color='gray'>
            Retreat
          </Text>
        </Flex>
        <Flex style={{ borderBottom: '1px solid var(--gray-6)' }}>
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            100%
          </Text>
          <Text size='3' color='gray'>
            Growth
          </Text>
        </Flex>
        <Flex>
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            28%
          </Text>
          <Text size='3' color='gray'>
            Stable
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)

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
    <>
      <CountryInfoCard selectedCountry={selectedCountry} />
      <Grid columns='2' gap='4'>
        <ShorelineChangeCard />
      </Grid>
    </>
  )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
