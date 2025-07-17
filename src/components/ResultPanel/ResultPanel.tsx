import { Card, Flex, Text } from '@radix-ui/themes'
import InfoCircledIcon from '../../assets/info-circled.svg'
import styles from './Result.module.scss'
import type { PacificCountry } from '../../library/types'
import useResponsive from '../../library/hooks/useResponsive'

const ResultHeaderCard = ({ selectedCountry }: { selectedCountry: PacificCountry | null }) => (
  <Card>
    <Flex direction='column' gap='2'>
      <Flex justify='between' align='start'>
        <Text as='div' size='6' weight='bold'>
          Coastline Change: {selectedCountry?.name}
        </Text>
        <img src={InfoCircledIcon} alt='Information about coastline change' />
      </Flex>
      <Text as='div' size='2' color='gray'>
        Estimated coastline change from 2000 to 2020
      </Text>
    </Flex>
  </Card>
)

const ErrorCard = () => (
  <Card className={styles.errorCard} variant='ghost'>
    <Flex align='center' gap='1'>
      <div className={styles.errorIcon} role='img' aria-label='Error information' />
      <Text as='div' size='2'>
        Unable to load data, please try again.
      </Text>
    </Flex>
  </Card>
)
export const ResultPanel = ({ selectedCountry }: { selectedCountry: PacificCountry | null }) => {
  const { isMobileWidth } = useResponsive()
  const isErrorCountry = selectedCountry?.name === 'Error Country' // Error country for testing purposes, remove in production

  return selectedCountry && !isMobileWidth ? (
    <div className={styles.resultContainer}>
      {!isErrorCountry && <ResultHeaderCard selectedCountry={selectedCountry} />}
      {isErrorCountry && <ErrorCard />}
    </div>
  ) : null
}
