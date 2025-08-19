import { Card, Flex, Text } from '@radix-ui/themes'
import useResponsive from '../../hooks/useResponsive'
import { useCountry } from '../../hooks/useCountry'

export const LocationCard = () => {
  const { isMobileWidth } = useResponsive()
  const { selectedCountry } = useCountry()

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
