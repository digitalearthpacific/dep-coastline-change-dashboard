import { Button, Flex, Link, Separator, Text } from '@radix-ui/themes'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import useResponsive from '../../library/hooks/useResponsive'

type BackButtonProps = {
  onClick?: () => void
}

const BackButton = ({ onClick }: BackButtonProps) => (
  <Button variant='ghost' aria-label='Back Button' onClick={onClick}>
    <ArrowLeftIcon />
    BACK
  </Button>
)

const ShorelineChangeSection = () => (
  <Flex direction='column' gap='4'>
    <Flex direction='column' gap='2'>
      <Text as='div' size='4' weight='bold'>
        Shoreline Change
      </Text>
      <Text as='div'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor sed quam ac
        faucibus. Phasellus ac nisl aliquet erat tempor scelerisque sit amet sed enim. Vestibulum
        convallis enim vitae ex placerat vehicula..
      </Text>
    </Flex>
    <Flex direction='column' gap='2'>
      <Text as='div' weight='bold'>
        Data Sources
      </Text>
      <Link href='#'>Link</Link>
    </Flex>
  </Flex>
)
const HotSpotsSection = () => (
  <Flex direction='column' gap='4'>
    <Flex direction='column' gap='2'>
      <Text as='div' size='4' weight='bold'>
        Hot Spots
      </Text>
      <Text as='div'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor sed quam ac
        faucibus. Phasellus ac nisl aliquet erat tempor scelerisque sit amet sed enim. Vestibulum
        convallis enim vitae ex placerat vehicula..
      </Text>
    </Flex>
    <Flex direction='column' gap='2'>
      <Text as='div' weight='bold'>
        Data Sources
      </Text>
      <Link href='#'>Link</Link>
    </Flex>
  </Flex>
)

const PopulationSection = () => (
  <Flex direction='column' gap='4'>
    <Flex direction='column' gap='2'>
      <Text as='div' size='4' weight='bold'>
        Population
      </Text>
      <Text as='div'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor sed quam ac
        faucibus. Phasellus ac nisl aliquet erat tempor scelerisque sit amet sed enim. Vestibulum
        convallis enim vitae ex placerat vehicula..
      </Text>
    </Flex>
    <Flex direction='column' gap='2'>
      <Text as='div' weight='bold'>
        Data Sources
      </Text>
      <Link href='#'>Link</Link>
    </Flex>
  </Flex>
)
const BuildingsSection = () => (
  <Flex direction='column' gap='4'>
    <Flex direction='column' gap='2'>
      <Text as='div' size='4' weight='bold'>
        Buildings
      </Text>
      <Text as='div'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor sed quam ac
        faucibus. Phasellus ac nisl aliquet erat tempor scelerisque sit amet sed enim. Vestibulum
        convallis enim vitae ex placerat vehicula..
      </Text>
    </Flex>
    <Flex direction='column' gap='2'>
      <Text as='div' weight='bold'>
        Data Sources
      </Text>
      <Link href='#'>Link</Link>
    </Flex>
  </Flex>
)
const MangrovesSection = () => (
  <Flex direction='column' gap='4'>
    <Flex direction='column' gap='2'>
      <Text as='div' size='4' weight='bold'>
        Mangroves
      </Text>
      <Text as='div'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor sed quam ac
        faucibus. Phasellus ac nisl aliquet erat tempor scelerisque sit amet sed enim. Vestibulum
        convallis enim vitae ex placerat vehicula..
      </Text>
    </Flex>
    <Flex direction='column' gap='2'>
      <Text as='div' weight='bold'>
        Data Sources
      </Text>
      <Link href='#'>Link</Link>
    </Flex>
  </Flex>
)

const BackgroundInformationView = ({ goBackToResultView }: { goBackToResultView: () => void }) => {
  const { isMobileWidth } = useResponsive()
  return (
    <Flex direction='column' gap='4' align='start'>
      <BackButton onClick={goBackToResultView} />
      <Text as='div' size={isMobileWidth ? '6' : '7'} weight='bold'>
        Background Information
      </Text>
      <ShorelineChangeSection />
      <Separator orientation='horizontal' size='4' />
      <HotSpotsSection />
      <Separator orientation='horizontal' size='4' />
      <PopulationSection />
      <Separator orientation='horizontal' size='4' />
      <BuildingsSection />
      <Separator orientation='horizontal' size='4' />
      <MangrovesSection />
    </Flex>
  )
}

export default BackgroundInformationView
