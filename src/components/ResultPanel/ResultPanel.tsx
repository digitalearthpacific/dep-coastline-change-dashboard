import { Badge, Card, Flex, Grid, Text } from '@radix-ui/themes'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import InfoCircledIcon from '../../assets/info-circled.svg'
import useResponsive from '../../library/hooks/useResponsive'
import type { PacificCountry, ResultPanelProps } from '../../library/types'
import styles from './Result.module.scss'

const LocationCard = ({ selectedCountry }: { selectedCountry: PacificCountry | null }) => {
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
  <Card>
    <Flex direction='column' gap='3'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Shoreline Change
          </Text>
          <img src={InfoCircledIcon} alt='Information about shoreline change' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: '12px' }}>
          The average annual rate of shoreline change
        </Text>
      </Flex>
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

const HotSpotsCard = () => (
  <Card>
    <Flex direction='column' gap='3'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Hot Spots
          </Text>
          <img src={InfoCircledIcon} alt='Information about hot spots' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: '12px' }}>
          Identifies coastal regions experiencing high levels of change
        </Text>
      </Flex>
      <Flex direction='column' gap='1'>
        <Flex justify='between' align='start' style={{ borderBottom: '1px solid var(--gray-6)' }}>
          <Text size='4' weight='bold'>
            - km
          </Text>
          <Badge size='1' color='crimson'>
            High Change (&gt;5m)
          </Badge>
        </Flex>
        <Flex justify='between' align='start' style={{ borderBottom: '1px solid var(--gray-6)' }}>
          <Text size='4' weight='bold'>
            100 km
          </Text>
          <Badge size='1' color='orange'>
            Moderate Change (3-5m)
          </Badge>
        </Flex>
        <Flex justify='between' align='start'>
          <Text size='4' weight='bold'>
            28 km
          </Text>
          <Badge size='1' color='cyan'>
            Low Change (2-3m)
          </Badge>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)

const PopulationCard = () => (
  <Card>
    <Flex direction='column' gap='5'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Population
          </Text>
          <img src={InfoCircledIcon} alt='Information about population' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: '12px' }}>
          Estimated population in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        1,234,567
      </Text>
    </Flex>
  </Card>
)

const BuildingCard = () => (
  <Card>
    <Flex direction='column' gap='5'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Buildings
          </Text>
          <img src={InfoCircledIcon} alt='Information about buildings' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: '12px' }}>
          Estimated number of buildings in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        4,567
      </Text>
    </Flex>
  </Card>
)

const MangrovesCard = () => (
  <Card>
    <Flex direction='column' gap='5'>
      <Flex direction='column' align='stretch' style={{ height: '80px' }}>
        <Flex justify='between' align='start'>
          <Text as='div' size='4' weight='bold'>
            Mangroves
          </Text>
          <img src={InfoCircledIcon} alt='Information about mangroves' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: '12px' }}>
          Estimated square area of mangroves in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        98,765 m&sup2;
      </Text>
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
      <LocationCard selectedCountry={selectedCountry} />
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard />
        <HotSpotsCard />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard />
        <BuildingCard />
        <MangrovesCard />
      </Grid>
    </>
  )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
