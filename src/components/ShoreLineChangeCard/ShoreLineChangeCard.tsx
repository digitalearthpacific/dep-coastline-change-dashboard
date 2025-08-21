import { Card, Flex, Text } from '@radix-ui/themes'
import InfoCircledIcon from '../../assets/info-circled.svg'
import { useCountry } from '../../hooks/useGlobalContext'

export const ShorelineChangeCard = () => {
  const { selectedCountryFeature } = useCountry()
  const shorelineChangeDirection = selectedCountryFeature?.properties?.shoreline_change_direction

  return (
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
            <Text size='4' weight='bold' style={{ width: '80px' }}>
              {shorelineChangeDirection?.percent_retreat ?? '-'}%
            </Text>
            <Text size='3' color='gray'>
              Retreat
            </Text>
          </Flex>
          <Flex
            align='center'
            style={{ borderBottom: '1px solid var(--gray-6)', padding: 'var(--space-1) 0' }}
          >
            <Text size='4' weight='bold' style={{ width: '80px' }}>
              {shorelineChangeDirection?.percent_growth ?? '-'}%
            </Text>
            <Text size='3' color='gray'>
              Growth
            </Text>
          </Flex>
          <Flex align='center' style={{ paddingTop: 'var(--space-1)' }}>
            <Text size='4' weight='bold' style={{ width: '80px' }}>
              {shorelineChangeDirection?.percent_stable ?? '-'}%
            </Text>
            <Text size='3' color='gray'>
              Stable
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}
