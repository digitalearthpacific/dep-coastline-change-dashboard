import { Flex, Table, Text } from '@radix-ui/themes'
import { BackButton } from '../BackButton'
import useResponsive from '../../hooks/useResponsive'
import { GLOSSARY_TERMS } from '../../library/constants'

export const GlossaryView = ({ goBackToResultView }: { goBackToResultView: () => void }) => {
  const { isMobileWidth } = useResponsive()
  return (
    <Flex direction='column' gap='4' align='start'>
      <BackButton onClick={goBackToResultView} />
      <Text as='div' size={isMobileWidth ? '6' : '7'} weight='bold'>
        Glossary
      </Text>
      <Table.Root variant='surface' style={{ width: '100%' }}>
        <Table.Body>
          {GLOSSARY_TERMS.map(({ term, definition }) => (
            <Table.Row key={term}>
              <Table.RowHeaderCell>
                <Text weight='bold'>{term}</Text>
              </Table.RowHeaderCell>
              <Table.Cell>{definition}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  )
}
