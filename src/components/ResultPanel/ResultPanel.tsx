import { Badge, Card, Flex, Grid, Text } from '@radix-ui/themes'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import InfoCircledIcon from '../../assets/info-circled.svg'
import useResponsive from '../../library/hooks/useResponsive'
import type { PacificCountry, ResultPanelProps } from '../../library/types'
import styles from './Result.module.scss'

// Mock data generation for coastline change statistics, WILL REMOVE LATER
type MockCoastLineChangeData = {
  shorelineChange: {
    retreat: number
    growth: number
    stable: number
  }
  hotSpots: {
    highChange: number
    moderateChange: number
    lowChange: number
  }
  population: number
  buildings: number
  mangroves: number
}

function generateRandomNumber(length: number, maxTo?: number): number {
  if (length < 1) return 0
  const min = Math.pow(10, length - 1)
  let max = Math.pow(10, length) - 1
  if (maxTo !== undefined && maxTo < max) {
    max = Math.max(min, maxTo)
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getMockData(): MockCoastLineChangeData {
  return {
    shorelineChange: {
      retreat: generateRandomNumber(2, 100),
      growth: generateRandomNumber(2, 100),
      stable: generateRandomNumber(2, 100),
    },
    hotSpots: {
      highChange: generateRandomNumber(3, 1000),
      moderateChange: generateRandomNumber(3, 1000),
      lowChange: generateRandomNumber(3, 1000),
    },
    population: generateRandomNumber(7, 10000000),
    buildings: generateRandomNumber(5, 100000),
    mangroves: generateRandomNumber(5, 100000),
  }
}
// End of mock data generation

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
            Estimated coastline change from 1999 to 2023
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}

const ShorelineChangeCard = ({
  shorelineChange,
}: {
  shorelineChange: MockCoastLineChangeData['shorelineChange'] | undefined
}) => (
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
            {shorelineChange?.retreat}%
          </Text>
          <Text size='3' color='gray'>
            Retreat
          </Text>
        </Flex>
        <Flex style={{ borderBottom: '1px solid var(--gray-6)' }}>
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            {shorelineChange?.growth}%
          </Text>
          <Text size='3' color='gray'>
            Growth
          </Text>
        </Flex>
        <Flex>
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            {shorelineChange?.stable}%
          </Text>
          <Text size='3' color='gray'>
            Stable
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)

const HotSpotsCard = ({
  hotSpots,
}: {
  hotSpots: MockCoastLineChangeData['hotSpots'] | undefined
}) => (
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
            {typeof hotSpots?.highChange === 'number' ? hotSpots.highChange.toLocaleString() : '-'}{' '}
            km
          </Text>
          <Badge size='1' color='crimson'>
            High Change (&gt;5m)
          </Badge>
        </Flex>
        <Flex justify='between' align='start' style={{ borderBottom: '1px solid var(--gray-6)' }}>
          <Text size='4' weight='bold'>
            {typeof hotSpots?.moderateChange === 'number'
              ? hotSpots.moderateChange.toLocaleString()
              : '-'}{' '}
            km
          </Text>
          <Badge size='1' color='orange'>
            Moderate Change (3-5m)
          </Badge>
        </Flex>
        <Flex justify='between' align='start'>
          <Text size='4' weight='bold'>
            {typeof hotSpots?.lowChange === 'number' ? hotSpots.lowChange.toLocaleString() : '-'} km
          </Text>
          <Badge size='1' color='cyan'>
            Low Change (2-3m)
          </Badge>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)

const PopulationCard = ({
  population,
}: {
  population: MockCoastLineChangeData['population'] | null
}) => (
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
        {population ? population.toLocaleString() : '-'}
      </Text>
    </Flex>
  </Card>
)

const BuildingCard = ({
  buildings,
}: {
  buildings: MockCoastLineChangeData['buildings'] | null
}) => (
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
        {buildings ? buildings.toLocaleString() : '-'}
      </Text>
    </Flex>
  </Card>
)

const MangrovesCard = ({
  mangroves,
}: {
  mangroves: MockCoastLineChangeData['mangroves'] | null
}) => (
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
        {mangroves ? mangroves.toLocaleString() : '-'} m&sup2;
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
  const mockData = isErrorCountry ? null : getMockData()
  const shorelineChange: MockCoastLineChangeData['shorelineChange'] | undefined =
    mockData?.shorelineChange ?? undefined
  const hotSpots: MockCoastLineChangeData['hotSpots'] | undefined = mockData?.hotSpots ?? undefined
  const population: number | null = mockData?.population ?? null
  const buildings: number | null = mockData?.buildings ?? null
  const mangroves: number | null = mockData?.mangroves ?? null

  if (!selectedCountry) return null

  const content = isErrorCountry ? (
    <ErrorCard />
  ) : (
    <>
      <LocationCard selectedCountry={selectedCountry} />
      <Grid columns={isMobileWidth ? '1' : '2'} gap='4'>
        <ShorelineChangeCard shorelineChange={shorelineChange} />
        <HotSpotsCard hotSpots={hotSpots} />
      </Grid>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard population={population} />
        <BuildingCard buildings={buildings} />
        <MangrovesCard mangroves={mangroves} />
      </Grid>
    </>
  )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
