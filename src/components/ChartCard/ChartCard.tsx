import { useCallback, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import Plotly from 'plotly.js-basic-dist'
import type { PlotData, PlotlyHTMLElement } from 'plotly.js'
import { Card, Flex, IconButton, Select, Text, Tooltip } from '@radix-ui/themes'
import { Cross1Icon } from '@radix-ui/react-icons'
import useResponsive from '../../library/hooks/useResponsive'
import { useFullscreen } from '../../library/hooks/useFullscreen'
import styles from './ChartCard.module.scss'
import { RATES_OF_CHANGE_YEARS } from '../../library/constants'
import { capitalize } from '../../library/utils/capitalize'
import type { PacificCountry } from '../../library/types'
import InfoCircledIcon from '../../assets/info-circled.svg'
import BarChartIcon from '../../assets/bar-chart.svg'
import LineChartIcon from '../../assets/line-chart.svg'
import DownloadIcon from '../../assets/download.svg'
import ChartFullscreenIcon from '../../assets/chart-full-screen.svg'

export const ChartCard = ({
  startDate,
  endDate,
  onDateChange,
  selectedCountry,
  selectedChartType,
  onChartTypeChange,
}: {
  startDate: string | null
  endDate: string | null
  onDateChange: (dateType: 'start' | 'end', value: string) => void
  selectedCountry: PacificCountry | null
  selectedChartType: 'bar' | 'line'
  onChartTypeChange: (type: 'bar' | 'line') => void
}) => {
  const { isMobileWidth } = useResponsive()
  const startDateSelectRef = useRef<HTMLDivElement>(null)
  const endDateSelectRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<PlotlyHTMLElement | null>(null)
  const {
    ref: chartContainerRef,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  } = useFullscreen<HTMLDivElement>()

  const startDateOptions = endDate
    ? RATES_OF_CHANGE_YEARS.filter((year) => year.value <= endDate)
    : RATES_OF_CHANGE_YEARS
  const endDateOptions = startDate
    ? RATES_OF_CHANGE_YEARS.filter((year) => year.value >= startDate)
    : RATES_OF_CHANGE_YEARS

  // Mock data for the chart with proper typing
  const chartData: PlotData[] =
    startDate && endDate
      ? [
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
      : []

  // Resize plot when container size changes
  useEffect(() => {
    if (!chartContainerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          // Container has dimensions, resize the plot
          if (plotRef.current) {
            setTimeout(() => {
              Plotly.Plots.resize(plotRef.current!)
            }, 100)
          }
        }
      }
    })

    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const handleDownload = useCallback(async () => {
    try {
      if (plotRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 100))

        await Plotly.downloadImage(plotRef.current as PlotlyHTMLElement, {
          format: 'png',
          width: 1200,
          height: 800,
          filename: `SP-${capitalize(selectedChartType)}-${selectedCountry?.name}-${startDate}-${endDate}`,
        })
      } else {
        console.error('Chart reference not found')
      }
    } catch (error) {
      console.error('Error downloading chart:', error)
      alert('Error downloading chart. Please try again.')
    }
  }, [plotRef, selectedChartType, selectedCountry, startDate, endDate])

  return (
    <Card>
      <Flex gap='2' direction='column' style={{ height: '400px' }}>
        <Flex justify='between' align='start' style={{ marginBottom: 'var(--space-2, 8px)' }}>
          <Text as='div' size='4' weight='bold'>
            Shoreline Position
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
                value={startDate || ''}
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
                  <Select.Item key='none' value='none'>
                    None
                  </Select.Item>
                  <Select.Separator />
                  {startDateOptions.map((year) => (
                    <Select.Item key={year.id} value={year.value}>
                      {year.value}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Select.Root
                value={endDate || ''}
                onValueChange={(value) => onDateChange('end', value)}
              >
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
                  <Select.Item key='none' value='none'>
                    None
                  </Select.Item>
                  <Select.Separator />
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
                <Tooltip content='View fullscreen' side='top'>
                  <IconButton onClick={enterFullscreen} aria-label='View Fullscreen'>
                    <img src={ChartFullscreenIcon} alt='Fullscreen Icon' />
                  </IconButton>
                </Tooltip>
              )}
            </Flex>
          </Flex>
        </Flex>
        <div
          ref={chartContainerRef}
          style={{
            flexGrow: 1,
            minHeight: '250px',
            position: 'relative',
            ...(isFullscreen && {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              backgroundColor: '#ffffff',
            }),
          }}
        >
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
                t: 10,
                b: undefined,
              },
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
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

          {isFullscreen && (
            <button onClick={exitFullscreen} className={styles.exitFullscreenButton}>
              <Cross1Icon />
              Exit Fullscreen
            </button>
          )}
        </div>
      </Flex>
    </Card>
  )
}
