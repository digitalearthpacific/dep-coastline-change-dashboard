import { Card, Flex, Text } from '@radix-ui/themes'
import styles from './ErrorCard.module.scss'
export const ErrorCard = () => (
  <div style={{ padding: 'var(--space-4)' }}>
    <Card className={styles.errorCard} variant='ghost'>
      <Flex align='center' gap='1'>
        <div className={styles.errorIcon} role='img' aria-label='Error information' />
        <Text as='div' size='2'>
          Unable to load data, please try again.
        </Text>
      </Flex>
    </Card>
  </div>
)
