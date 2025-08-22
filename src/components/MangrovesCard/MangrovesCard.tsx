import { Card, Flex, Text } from '@radix-ui/themes'
import InfoCircledIcon from '../../assets/info-circled.svg'
import { useCountry } from '../../hooks/useGlobalContext'

export const MangrovesCard = () => {
  const { selectedCountryFeature } = useCountry()
  const mangroveAreaHa = selectedCountryFeature?.properties?.mangrove_area_ha_in_hotspots ?? '-'

  return (
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
          {mangroveAreaHa.toLocaleString()} ha
        </Text>
      </Flex>
    </Card>
  )
}
