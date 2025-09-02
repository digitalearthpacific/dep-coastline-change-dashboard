import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover'

type RateOfChangeCardProps = {
  rateOfChange: number | null
}

const RATE_OF_CHANGE_INFO =
  'The rate of change values were calculated by comparing shoreline positions along transects over all years of available data (maximally 1999-2023). Transects were evenly spaced at 30-meter intervals. Rate of change values were calculated via a linear regression between year (x) and median distances (y) among all transects within each hotspot.'

const formatRateOfChange = (rate: number | null): string => {
  if (rate === null) return '—'
  return `${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} m/year`
}

export const RateOfChangeCard = ({ rateOfChange }: RateOfChangeCardProps) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <header style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Rate of Change
            </Text>
            <CustomPopover
              ariaLabel='Information about rate of change'
              content={RATE_OF_CHANGE_INFO}
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated rate of change in hotspot coastal areas
          </Text>
        </header>

        <Text as='div' size='8' weight='bold'>
          {formatRateOfChange(rateOfChange)}
        </Text>
      </Flex>
    </Card>
  )
}
