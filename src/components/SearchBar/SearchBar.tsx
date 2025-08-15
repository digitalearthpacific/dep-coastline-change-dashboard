import { Button, DropdownMenu } from '@radix-ui/themes'
import styles from './SearchBar.module.scss'
import DEPLogo from '../../assets/DEP-logo.jpg'
import { NONE_VALUE, PACIFIC_COUNTRIES } from '../../library/constants'
import type { SearchBarProps } from '../../library/types'

export const SearchBar = ({ selectedCountry, onCountrySelect }: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <img src={DEPLogo} alt='Digital Earth Pacific' className={styles.logo} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button className={styles.dropdownButton}>
            {selectedCountry?.name || 'Select location for coastline data'}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.dropdownContent}>
          <DropdownMenu.Item key={NONE_VALUE} onSelect={() => onCountrySelect(null)}>
            None
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {PACIFIC_COUNTRIES.map((country) => (
            <DropdownMenu.Item key={country.id} onSelect={() => onCountrySelect(country)}>
              {country.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
