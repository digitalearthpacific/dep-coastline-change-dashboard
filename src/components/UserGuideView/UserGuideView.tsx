import { AspectRatio, Flex, Separator, Table, Text } from '@radix-ui/themes'
import { BackButton } from '../BackButton'
import useResponsive from '../../hooks/useResponsive'
import { USER_GUIDE_TERMINOLOGY } from '../../library/constants'
import DashboardLayout from '../../assets/dashboard-layout.png'

const IntroductionSection = () => (
  <Flex direction='column' gap='3'>
    <Flex direction='column' gap='2'>
      <Text size='4' weight='bold'>
        1. Introduction
      </Text>
      <Text size='3'>
        The Coastline Change dashboard provides an easy way to visualize how coastlines across
        Pacific Island nations are changing. By transforming complex data into simple, actionable
        insights, the dashboard supports informed decision making. This guide will walk you through
        the interface, available tools, and how to explore coastline changes across the Pacific.
      </Text>
    </Flex>
  </Flex>
)

const AboutDashboardSection = () => (
  <Flex direction='column' gap='3'>
    <Flex direction='column' gap='2'>
      <Text size='4' weight='bold'>
        2. About the Dashboard
      </Text>
      <Text size='3'>
        Pacific nations face a range of coastal hazards, yet many decision makers lack clear,
        location specific insights to guide policy, funding, and mitigation.
      </Text>
      <Flex direction='column'>
        <Text size='3' weight='bold'>
          The Coastline Change dashboard provides:
        </Text>
        <ul>
          <li>
            <Text size='3'>Identification of hotspots for coastal growth and retreat.</Text>
          </li>
          <li>
            <Text size='3'>Clear easy to understand statistics.</Text>
          </li>
          <li>
            <Text size='3'>
              A user friendly interface for exploring coastline changes without technical expertise.
            </Text>
          </li>
          <li>
            <Text size='3'>
              Reliable information to support planning, advocacy, reporting, and resource
              allocation.
            </Text>
          </li>
        </ul>
      </Flex>
    </Flex>
  </Flex>
)

const WhoDashboardForSection = () => (
  <Flex direction='column' gap='3'>
    <Flex direction='column' gap='2'>
      <Text size='4' weight='bold'>
        3. Who the Dashboard is for
      </Text>
      <Text size='3'>
        The dashboard is designed for users who need to understand and act on coastline change data
        without requiring technical GIS expertise.
      </Text>
      <Flex direction='column'>
        <Text size='3' weight='bold'>
          Including but not limited to:
        </Text>
        <ul>
          <li>
            <Text size='3'>
              National government officials, decision makers and policymakers responsible for
              planning, funding, and implementing coastal management strategies.
            </Text>
          </li>
          <li>
            <Text size='3'>
              Disaster management and climate adaptation teams monitoring coastal hazards and
              prioritizing interventions.
            </Text>
          </li>
          <li>
            <Text size='3'>
              SPC directors, managers, and technical staff coordinating regional programs and using
              coastline data to support evidence based decisions.
            </Text>
          </li>
          <li>
            <Text size='3'>
              Community leaders involved in local planning, advocacy, and resilience initiatives.
            </Text>
          </li>
        </ul>
      </Flex>
    </Flex>
  </Flex>
)

const DashboardLayoutOverviewSection = () => (
  <Flex direction='column' gap='3'>
    <Flex direction='column' gap='2'>
      <Text size='4' weight='bold'>
        4. Dashboard Layout Overview
      </Text>
      <AspectRatio ratio={16 / 9}>
        <img
          src={DashboardLayout}
          alt='Dashboard Layout Overview'
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--gray-6)',
          }}
        />
      </AspectRatio>
      <Flex direction='column'>
        <Text size='3' weight='bold'>
          The dashboard interface includes the following elements:
        </Text>
        <ul>
          <li>
            <Text size='3'>Navigation menu to select a location.</Text>
          </li>
          <li>
            <Text size='3'>
              Interactive map visualizing hotspots of high, moderate, and low levels of change
            </Text>
          </li>
          <li>
            <Text size='3'>Legend indicating the meaning of map elements and their colors</Text>
          </li>
          <li>
            <Text size='3'>Map tools</Text>
            <ol type='a'>
              <li>
                <Text size='3'>Zoom</Text>
              </li>
              <li>
                <Text size='3'>Draw</Text>
              </li>
              <li>
                <Text size='3'>Measure</Text>
              </li>
              <li>
                <Text size='3'>Coastline layers</Text>
              </li>
              <li>
                <Text size='3'>Reset map to default</Text>
              </li>
              <li>
                <Text size='3'>Basemap and layer options</Text>
              </li>
              <li>
                <Text size='3'>View map in fullscreen</Text>
              </li>
            </ol>
          </li>
          <li>
            <Text size='3'>
              Statistics and information panels for insights, background information and glossary of
              terms.
            </Text>
          </li>
        </ul>
      </Flex>
    </Flex>
  </Flex>
)

const TerminologySection = () => (
  <Flex direction='column' gap='3' align='start'>
    <Text size='4' weight='bold'>
      5. Terminology
    </Text>
    <Table.Root variant='surface' style={{ width: '100%' }}>
      <Table.Body>
        {USER_GUIDE_TERMINOLOGY.map(({ term, definition }) => {
          return (
            <Table.Row key={term}>
              <Table.RowHeaderCell>
                <Text size='3' weight='bold'>
                  {term}
                </Text>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Text size='3'>{definition}</Text>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  </Flex>
)

const NavigatingTheDashboardSection = () => (
  <Flex direction='column' gap='3'>
    <Text size='4' weight='bold'>
      6. Navigating the Dashboard
    </Text>
    <AspectRatio ratio={16 / 9}>
      <img
        src={DashboardLayout}
        alt='Dashboard Layout Overview'
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius-2)',
          border: '1px solid var(--gray-6)',
        }}
      />
    </AspectRatio>
    <ol>
      <li>
        <Text size='3'>Select a location from the navigation menu to focus your analysis</Text>
      </li>
      <li>
        <Text size='3'>
          View hotspots on the interactive map, click a hotspot to see statistics for that specific
          area
        </Text>
      </li>
      <li>
        <Text size='3'>
          Use the legend to interpret the levels of change for retreat and growth:
        </Text>
      </li>
      <ol type='a'>
        <li>
          <Text size='3'>High: &gt;5 m per year</Text>
        </li>
        <li>
          <Text size='3'>Moderate: &gt;3m per year</Text>
        </li>
        <li>
          <Text size='3'>Low: &gt;2 m per year</Text>
        </li>
      </ol>
      <li>
        <Text size='3'>
          View estimated population, buildings, and mangroves in coastal areas in the statistics
          panel
        </Text>
      </li>
      <li>
        <Text size='3'>Zoom and pan the map to explore specific areas in more detail</Text>
      </li>
    </ol>
  </Flex>
)

const UsingMapToolsSection = () => (
  <Flex direction='column' gap='3'>
    <Text size='4' weight='bold'>
      7. Using the Map and Tools
    </Text>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        7.1 Map Tools
      </Text>
      <ul>
        <li>
          <Text size='3'>Zoom: navigate the map to focus on areas of interest</Text>
        </li>
        <li>
          <Text size='3'>Draw: draw specific areas for closer analysis</Text>
        </li>
        <li>
          <Text size='3'>Measure: calculate distances directly on the map</Text>
        </li>
        <li>
          <Text size='3'>
            Coastline layers: adjust which coastline layers are visible on the map
          </Text>
        </li>
        <li>
          <Text size='3'>Reset map: return the map to the default country view and statistics</Text>
        </li>
        <li>
          <Text size='3'>Fullscreen: expand the map to fill your screen for a larger view</Text>
        </li>
      </ul>
    </Flex>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        7.2 Basemap and Layers Control
      </Text>
      <ul>
        <li>
          <Text size='3'>Basemaps: switch between satellite, streets, light, or dark options</Text>
        </li>
        <li>
          <Text size='3'>Layers: toggle mangroves and buildings layers on or off</Text>
        </li>
        <li>
          <Text size='3'>
            Coastline layers: customize which coastline layers are visible on the map
          </Text>
        </li>
        <ul>
          <li>
            <Text size='3'>Toggle all layers on or off</Text>
          </li>
          <li>
            <Text size='3'>Date Range (e.g. 2020–2023)</Text>
          </li>
          <li>
            <Text size='3'>Custom years (e.g. 1999, 2013, 2023)</Text>
          </li>
          <li>
            <Text size='3'>Show coastlines before a specified year (e.g. before 2001)</Text>
          </li>
          <li>
            <Text size='3'>Show coastlines after a specified year (e.g. after 2001)</Text>
          </li>
        </ul>
      </ul>
    </Flex>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        7.3 Legend and Color Scales
      </Text>
      <Text size='3'>The legend helps interpret the map by showing:</Text>
      <ul>
        <li>
          <Text size='3'>
            Retreat: orange shades indicate high, moderate, and low levels of change
          </Text>
        </li>
        <li>
          <Text size='3'>
            Growth: blue shades indicate high, moderate, and low levels of change
          </Text>
        </li>
        <li>
          <Text size='3'>Mangroves: purple shades indicate high or low density</Text>
        </li>
        <li>
          <Text size='3'>Buildings: gray </Text>
        </li>
        <li>
          <Text size='3'>Low quality coastlines: dashed lines</Text>
        </li>
      </ul>
    </Flex>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        7.4 Statistics Panel
      </Text>
      <Text size='3' weight='bold'>
        Hotspots
      </Text>
      <ul>
        <li>
          <Text size='3'>
            By default low change (&gt;2 m per year) hotspots are visible on the map.
          </Text>
        </li>
        <li>
          <Text size='3'>
            You can filter hotspots to show high, moderate, or low levels of change for retreat and
            growth hotspots on the map.
          </Text>
        </li>
      </ul>
      <Text size='3' weight='bold'>
        Key Statistics
      </Text>
      <ul>
        <li>
          <Text size='3'>
            When you select a location, the panel displays country level estimates for population,
            buildings, and mangroves within coastal areas.
          </Text>
        </li>
        <li>
          <Text size='3'>
            Statistics update dynamically based on the current map view as you zoom or pan.
          </Text>
        </li>
      </ul>
    </Flex>
  </Flex>
)

const UseCasesSection = () => (
  <Flex direction='column' gap='3'>
    <Text size='4' weight='bold'>
      8. Use Cases
    </Text>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        8.1 Identify high change hotspots
      </Text>
      <ol type='a'>
        <li>
          <Text size='3'>Select a location from the navigation menu</Text>
        </li>
        <li>
          <Text size='3'>Select high change on the hotspot card</Text>
        </li>
        <li>
          <Text size='3'>Zoom or draw an area of interest</Text>
        </li>
        <li>
          <Text size='3'>
            View estimated population, buildings, and mangroves in coastal areas in the statistics
            panel
          </Text>
        </li>
      </ol>
    </Flex>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        8.2 Identify moderate change growth hotspots
      </Text>
      <ol type='a'>
        <li>
          <Text size='3'>Select a location from the navigation menu</Text>
        </li>
        <li>
          <Text size='3'>Select moderate change on the hotspot card</Text>
        </li>
        <li>
          <Text size='3'>Zoom or draw an area of interest</Text>
        </li>
        <li>
          <Text size='3'>Identify growth hotspots indicated in blue on the map</Text>
        </li>
        <li>
          <Text size='3'>
            View estimated population, buildings, and mangroves in coastal areas in the statistics
            panel
          </Text>
        </li>
      </ol>
    </Flex>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        8.3 Draw an area of interest
      </Text>
      <ol type='a'>
        <li>
          <Text size='3'>Select the draw tool</Text>
        </li>
        <li>
          <Text size='3'>Select a shape (polygon, rectangle or circle)</Text>
        </li>
        <li>
          <Text size='3'>Draw the area on the map</Text>
        </li>
        <li>
          <Text size='3'>
            View estimated population, buildings, and mangroves in coastal areas in the statistics
            panel
          </Text>
        </li>
      </ol>
    </Flex>
    <Flex direction='column'>
      <Text size='3' weight='bold'>
        8.4 Generate a Report
      </Text>
      <ol type='a'>
        <li>
          <Text size='3'>Click the Export Report button</Text>
        </li>
        <li>
          <Text size='3'>
            Select your preferred file format (PDF or JPG) from the drop down menu
          </Text>
        </li>
      </ol>
    </Flex>
  </Flex>
)

const SupportFeedbackSection = () => (
  <Flex direction='column' gap='3'>
    <Text size='4' weight='bold'>
      9. Support and Feedback
    </Text>
    <Text size='3'>
      For help, feedback, or bug reports contact us at{' '}
      <a href='mailto:askdepacific@spc.int'>askdepacific@spc.int</a>
    </Text>
  </Flex>
)

export const UserGuideView = ({ goBackToResultView }: { goBackToResultView: () => void }) => {
  const { isMobileWidth } = useResponsive()

  return (
    <Flex direction='column' gap='4' align='start'>
      <BackButton onClick={goBackToResultView} />
      <Text size={isMobileWidth ? '6' : '7'} weight='bold'>
        User Guide
      </Text>
      <Text>Last Updated: dd/mm/yyyy</Text>
      <IntroductionSection />
      <Separator orientation='horizontal' size='4' />
      <AboutDashboardSection />
      <Separator orientation='horizontal' size='4' />
      <WhoDashboardForSection />
      <Separator orientation='horizontal' size='4' />
      <DashboardLayoutOverviewSection />
      <Separator orientation='horizontal' size='4' />
      <TerminologySection />
      <Separator orientation='horizontal' size='4' />
      <NavigatingTheDashboardSection />
      <Separator orientation='horizontal' size='4' />
      <UsingMapToolsSection />
      <Separator orientation='horizontal' size='4' />
      <UseCasesSection />
      <Separator orientation='horizontal' size='4' />
      <SupportFeedbackSection />
      <Separator orientation='horizontal' size='4' />
    </Flex>
  )
}
