import { Card, Flex, Text } from '@radix-ui/themes'
import { CustomPopover } from '../CustomPopover/CustomPopover'

export const RateOfChangeCard = ({ rateOfChange }: { rateOfChange: number | string }) => {
  return (
    <Card>
      <Flex direction='column' gap='5'>
        <Flex direction='column' align='stretch' style={{ height: '80px' }}>
          <Flex justify='between' align='start'>
            <Text as='div' size='4' weight='bold'>
              Rate of Change
            </Text>
            <CustomPopover
              ariaLabel='Information about rate of change'
              content={
                'The rate of change values were calculated by comparing shoreline positions along transects over all years of available data (maximally 1999-2023). Transects were evenly spaced at 30-meter intervals. Rate of change values were calculated via a linear regression between year (x) and median distances (y) among all transects within each hotspot.'
              }
            />
          </Flex>
          <Text as='div' size='2' color='gray' style={{ marginBottom: 'var(--space-3)' }}>
            Estimated rate of change in hotspot coastal areas
          </Text>
        </Flex>
        <Text as='div' size='8' weight='bold'>
          {rateOfChange.toLocaleString()} m/year
        </Text>
      </Flex>
    </Card>
  )
}
