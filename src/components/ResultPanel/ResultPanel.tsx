import { useState, useRef, useCallback } from 'react'
import { Badge, Card, Flex, Grid, IconButton, Select, Text, Tooltip } from '@radix-ui/themes'
import Plot from 'react-plotly.js'
import Plotly from 'plotly.js-basic-dist'
import type { PlotData, PlotlyHTMLElement } from 'plotly.js'

import { MobileResultBottomPanel } from '../MobileResultBottomPanel'
import InfoCircledIcon from '../../assets/info-circled.svg'
import BarChartIcon from '../../assets/bar-chart.svg'
import LineChartIcon from '../../assets/line-chart.svg'
import DownloadIcon from '../../assets/download.svg'
import ChartFullscreenIcon from '../../assets/chart-full-screen.svg'
import useResponsive from '../../library/hooks/useResponsive'
import type { PacificCountry, ResultPanelProps } from '../../library/types'
import { RATES_OF_CHANGE_YEARS } from '../../library/constants'
import styles from './Result.module.scss'
import { requestFullscreen } from '../../library/utils/requestFullscreen'
import { capitalize } from '../../library/utils/capitalize'

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
          <img src={InfoCircledIcon} alt='Information Icon About Location' />
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
          <img src={InfoCircledIcon} alt='Information Icon About Shoreline Change' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          The average annual rate of shoreline change
        </Text>
      </Flex>
      <Flex direction='column'>
        <Flex
          align='center'
          style={{ borderBottom: '1px solid var(--gray-6)', paddingBottom: 'var(--space-1)' }}
        >
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            {shorelineChange?.retreat}%
          </Text>
          <Text size='3' color='gray'>
            Retreat
          </Text>
        </Flex>
        <Flex
          align='center'
          style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
        >
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            {shorelineChange?.growth}%
          </Text>
          <Text size='3' color='gray'>
            Growth
          </Text>
        </Flex>
        <Flex align='center' style={{ paddingTop: 'var(--space-1)' }}>
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
          <img src={InfoCircledIcon} alt='Information Icon About Hot Spots' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          Identifies coastal regions experiencing high levels of change
        </Text>
      </Flex>
      <Flex direction='column'>
        <Flex
          justify='between'
          align='center'
          style={{ borderBottom: '1px solid var(--gray-6)', paddingBottom: 'var(--space-1)' }}
        >
          <Text size='4' weight='bold'>
            {typeof hotSpots?.highChange === 'number' ? hotSpots.highChange.toLocaleString() : '-'}{' '}
            km
          </Text>
          <Badge size='1' style={{ backgroundColor: 'var(--error-a3)', color: 'var(--error-a11)' }}>
            High Change (&gt;5m)
          </Badge>
        </Flex>
        <Flex
          justify='between'
          align='center'
          style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
        >
          <Text size='4' weight='bold'>
            {typeof hotSpots?.moderateChange === 'number'
              ? hotSpots.moderateChange.toLocaleString()
              : '-'}{' '}
            km
          </Text>
          <Badge
            size='1'
            style={{ backgroundColor: 'var(--warning-a3)', color: 'var(--warning-a11)' }}
          >
            Moderate Change (3-5m)
          </Badge>
        </Flex>
        <Flex justify='between' align='center' style={{ paddingTop: 'var(--space-1)' }}>
          <Text size='4' weight='bold' style={{ width: '60px' }}>
            {typeof hotSpots?.lowChange === 'number' ? hotSpots.lowChange.toLocaleString() : '-'} km
          </Text>
          <Badge
            size='1'
            style={{
              backgroundColor: 'var(--success-a3)',
              color: 'var(--success-a11)',
            }}
          >
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
          <img src={InfoCircledIcon} alt='Information Icon About Population' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
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
          <img src={InfoCircledIcon} alt='Information Icon About Buildings' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
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
          <img src={InfoCircledIcon} alt='Information Icon About Mangroves' />
        </Flex>
        <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
          Estimated square area of mangroves in hot spot coastal areas
        </Text>
      </Flex>
      <Text as='div' size='8' weight='bold'>
        {mangroves ? mangroves.toLocaleString() : '-'} m&sup2;
      </Text>
    </Flex>
  </Card>
)

const ChartCard = ({
  startDate,
  endDate,
  onDateChange,
  selectedCountry,
  selectedChartType,
  onChartTypeChange,
}: {
  startDate: string | undefined
  endDate: string | undefined
  onDateChange: (dateType: 'start' | 'end', value: string | undefined) => void
  selectedCountry: PacificCountry | null
  selectedChartType: 'bar' | 'line'
  onChartTypeChange: (type: 'bar' | 'line') => void
}) => {
  const { isMobileWidth } = useResponsive()
  const startDateSelectRef = useRef<HTMLDivElement>(null)
  const endDateSelectRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<PlotlyHTMLElement | null>(null)

  const startDateOptions = endDate
    ? RATES_OF_CHANGE_YEARS.filter((year) => year.value <= endDate)
    : RATES_OF_CHANGE_YEARS
  const endDateOptions = startDate
    ? RATES_OF_CHANGE_YEARS.filter((year) => year.value >= startDate)
    : RATES_OF_CHANGE_YEARS

  // Mock data for the chart with proper typing
  const chartData: PlotData[] = [
    {
      x: [1999, 2000, 2005, 2010, 2015, 2020, 2023],
      y: [-22, 24, 13, 30, 3, -18, 11],
      type: selectedChartType === 'line' ? 'scatter' : 'bar',
      mode: selectedChartType === 'line' ? 'lines+markers' : undefined,
      name: 'Coastline Change (m)',
      line: selectedChartType === 'line' ? { color: '#0097d2', width: 3 } : undefined,
      marker: {
        color: '#0097d2',
        size: selectedChartType === 'line' ? 8 : undefined,
      },
    } as PlotData,
  ]

  const handleDownload = useCallback(async () => {
    try {
      if (plotRef.current) {
        console.log('Downloading chart as PNG...')
        console.log(capitalize(selectedChartType))
        console.log(selectedCountry)
        console.log(startDate)
        await new Promise((resolve) => setTimeout(resolve, 100))

        await Plotly.downloadImage(plotRef.current as PlotlyHTMLElement, {
          format: 'png',
          width: 1200,
          height: 800,
          filename: `ROC-${capitalize(selectedChartType)}-${selectedCountry?.name}-${startDate}-${endDate}`,
        })
      } else {
        console.error('Chart reference not found')
      }
    } catch (error) {
      console.error('Error downloading chart:', error)
      alert('Error downloading chart. Please try again.')
    }
  }, [plotRef, selectedChartType, selectedCountry, startDate, endDate])

  const handleFullscreen = () => {
    requestFullscreen(plotRef.current)
  }

  return (
    <Card>
      <Flex direction='column' style={{ height: '400px' }}>
        <Flex justify='between' align='start' style={{ marginBottom: 'var(--space-2, 8px)' }}>
          <Text as='div' size='4' weight='bold'>
            Rates of Change
          </Text>
          <img src={InfoCircledIcon} alt='Information Icon About Rates of Change' />
        </Flex>
        <Flex
          gap='2'
          direction={{ initial: 'column-reverse', sm: 'row' }}
          justify={{ initial: 'start', sm: 'between' }}
          align={{ initial: 'stretch', sm: 'end' }}
        >
          <Flex direction='column' gap='1'>
            <Text as='div' size='1'>
              Select date range to view on map
            </Text>
            <Flex gap='3'>
              <Select.Root
                value={startDate}
                onValueChange={(value) => onDateChange('start', value)}
              >
                <Select.Trigger placeholder='Start Date' style={{ width: '110px' }} />
                <Select.Content
                  position='popper'
                  ref={startDateSelectRef}
                  style={{
                    maxHeight: '170px',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehaviorY: 'contain',
                  }}
                >
                  {startDateOptions.map((year) => (
                    <Select.Item key={year.id} value={year.value}>
                      {year.value}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Select.Root value={endDate} onValueChange={(value) => onDateChange('end', value)}>
                <Select.Trigger placeholder='End Date' style={{ width: '110px' }} />
                <Select.Content
                  position='popper'
                  ref={endDateSelectRef}
                  style={{
                    maxHeight: '170px',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehaviorY: 'contain',
                  }}
                >
                  {endDateOptions.map((year) => (
                    <Select.Item key={year.id} value={year.id}>
                      {year.value}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
          <Flex
            gap='2'
            justify={{ initial: 'between', sm: 'start' }}
            className={styles.chartTypeSelectorContainer}
          >
            <Flex gap='2'>
              <Tooltip content='Line chart' side='top'>
                <IconButton
                  data-state={selectedChartType === 'line' ? 'active' : undefined}
                  onClick={() => onChartTypeChange('line')}
                  aria-label='Line Chart'
                >
                  <img src={LineChartIcon} alt='Line Chart Icon' />
                </IconButton>
              </Tooltip>
              <Tooltip content='Bar chart' side='top'>
                <IconButton
                  data-state={selectedChartType === 'bar' ? 'active' : undefined}
                  onClick={() => onChartTypeChange('bar')}
                  aria-label='Bar Chart'
                >
                  <img src={BarChartIcon} alt='Bar Chart Icon' />
                </IconButton>
              </Tooltip>
            </Flex>
            <Flex gap='2'>
              <Tooltip content='Download chart as PNG' side='top'>
                <IconButton
                  disabled={!plotRef.current || !startDate || !endDate}
                  onClick={handleDownload}
                  aria-label='Download Chart as PNG'
                >
                  <img src={DownloadIcon} alt='Download Icon' />
                </IconButton>
              </Tooltip>
              {!isMobileWidth && (
                <Tooltip content='Fullscreen chart' side='top'>
                  <IconButton onClick={handleFullscreen} aria-label='Fullscreen Chart'>
                    <img src={ChartFullscreenIcon} alt='Fullscreen Icon' />
                  </IconButton>
                </Tooltip>
              )}
            </Flex>
          </Flex>
        </Flex>
        <div style={{ flexGrow: 1, minHeight: '250px' }}>
          <Plot
            data={chartData}
            layout={{
              height: 280,
              autosize: true,
              dragmode: false,
              xaxis: {
                title: { text: 'Year' },
                gridcolor: '#f0f0f0',
              },
              yaxis: {
                title: { text: 'Distance (kilometers)' },
                gridcolor: '#f0f0f0',
                zeroline: true,
                zerolinecolor: '#888888',
                zerolinewidth: 1,
              },
              font: {
                family: 'var(--font-family-primary)',
                size: 12,
              },
              margin: {
                l: 50,
                r: 10,
                t: 20,
              },
            }}
            style={{ width: '100%', height: '100%' }}
            config={{
              displayModeBar: false,
              responsive: true,
              staticPlot: false,
            }}
            useResizeHandler
            onInitialized={(_, graphDiv) => {
              plotRef.current = graphDiv as PlotlyHTMLElement
            }}
          />
        </div>
      </Flex>
    </Card>
  )
}

const ErrorCard = () => (
  <div style={{ padding: 'var(--space-4)' }}>
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
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line'>('line')

  const isErrorCountry = selectedCountry?.name === 'Error Country'
  const mockData = isErrorCountry ? null : getMockData()
  const shorelineChange: MockCoastLineChangeData['shorelineChange'] | undefined =
    mockData?.shorelineChange ?? undefined
  const hotSpots: MockCoastLineChangeData['hotSpots'] | undefined = mockData?.hotSpots ?? undefined
  const population: number | null = mockData?.population ?? null
  const buildings: number | null = mockData?.buildings ?? null
  const mangroves: number | null = mockData?.mangroves ?? null

  if (!selectedCountry) return null

  const handleDateChange = (dateType: 'start' | 'end', value: string | undefined) => {
    if (dateType === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const handleChartTypeChange = (type: 'bar' | 'line') => {
    setSelectedChartType(type)
  }

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
      <ChartCard
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        selectedCountry={selectedCountry}
        selectedChartType={selectedChartType}
        onChartTypeChange={handleChartTypeChange}
      />
    </>
  )

  if (isMobileWidth) {
    return <MobileResultBottomPanel open={isMobilePanelOpen}>{content}</MobileResultBottomPanel>
  }

  return <div className={styles.resultSideContainer}>{content}</div>
}
