import { Card, Flex, Text } from '@radix-ui/themes'
import useResponsive from '../../hooks/useResponsive'
import { useMapData } from '../../hooks/useGlobalContext'
import { getNameByCountryCode } from '../../library/utils'

export const LocationCard = () => {
  const { isMobileWidth } = useResponsive()
  const { selectedCountryFeature } = useMapData()

  const countryName = selectedCountryFeature ? getNameByCountryCode(selectedCountryFeature) : '-'

  return (
    <Card>
      <Flex direction='column' gap='2' justify='between'>
        <Flex justify='between' align='start'>
          {isMobileWidth ? (
            <Flex direction='column' gap='1'>
              <Text as='div' size='6' weight='bold'>
                Shoreline Change:
              </Text>
              <Text as='div' size='6' weight='bold'>
                {countryName}
              </Text>
            </Flex>
          ) : (
            <Text as='div' size='7' weight='bold'>
              Shoreline Change: {countryName}
            </Text>
          )}
        </Flex>
        <Flex>
          <Text as='div' size={isMobileWidth ? '2' : '3'} color='gray'>
            Estimated shoreline change from data collected between 1999 and 2023
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}
