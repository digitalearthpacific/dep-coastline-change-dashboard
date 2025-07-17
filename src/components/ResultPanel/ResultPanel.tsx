import { Card, Flex, Text } from '@radix-ui/themes'
import InfoCircledIcon from '../../assets/info-circled.svg'
import styles from './Result.module.scss'
import type { PacificCountry } from '../../library/types'

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

export const ResultPanel = ({ selectedCountry }: { selectedCountry: PacificCountry | null }) => {
  return selectedCountry ? (
    <div className={styles.resultContainer}>
      {<ResultHeaderCard selectedCountry={selectedCountry} />}
    </div>
  ) : null
}
