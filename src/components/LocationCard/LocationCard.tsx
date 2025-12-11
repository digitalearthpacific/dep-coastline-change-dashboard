import { Flex, Text } from '@radix-ui/themes'
import useResponsive from '../../hooks/useResponsive'
import { useMapData } from '../../hooks/useGlobalContext'
import { getNameByCountryCode } from '../../library/utils'
import commonStyles from '../../styles/common.module.scss'

export const LocationCard = () => {
  const { isMobileWidth } = useResponsive()
  const { selectedCountryFeature } = useMapData()

  const countryName = selectedCountryFeature ? getNameByCountryCode(selectedCountryFeature) : '-'

  return (
    <div className={commonStyles.appCard}>
      <Flex direction='column' gap='2' justify='between'>
        <Flex justify='between' align='start'>
          {isMobileWidth ? (
            <Flex direction='column' gap='1'>
              <Text as='div' size='6' weight='bold'>
                Coastline Change:
              </Text>
              <Text as='div' size='6' weight='bold'>
                {countryName}
              </Text>
            </Flex>
          ) : (
            <Text as='div' size='7' weight='bold'>
              Coastline Change: {countryName}
            </Text>
          )}
        </Flex>
        <Flex>
          <Text as='div' size={isMobileWidth ? '2' : '3'} color='gray'>
            Estimated coastline change from data collected between 1999 and 2023
          </Text>
        </Flex>
      </Flex>
    </div>
  )
}
