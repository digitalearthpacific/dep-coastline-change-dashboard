import { Flex, Text } from '@radix-ui/themes'
import { BackButton } from '../BackButton'
import useResponsive from '../../hooks/useResponsive'

export const UserGuideView = ({ goBackToResultView }: { goBackToResultView: () => void }) => {
  const { isMobileWidth } = useResponsive()

  return (
    <Flex direction='column' gap='4' align='start'>
      <BackButton onClick={goBackToResultView} />
      <Text as='div' size={isMobileWidth ? '6' : '7'} weight='bold'>
        User Guide
      </Text>
    </Flex>
  )
}
