import { Button, Flex } from '@radix-ui/themes'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

type BackButtonProps = {
  onClick?: () => void
  children?: React.ReactNode
}

export const BackButton = ({ onClick, children = 'BACK' }: BackButtonProps) => (
  <Flex pl='2' className='hide-on-export'>
    <Button variant='ghost' aria-label='Back Button' onClick={onClick}>
      <ArrowLeftIcon />
      {children}
    </Button>
  </Flex>
)
