import { Button, DropdownMenu } from '@radix-ui/themes'
import styles from './SearchBar.module.scss'
import DEPLogo from '../../assets/DEP-logo.jpg'

// Pacific Island countries array
const pacificCountries = [
  { id: 'american-samoa', name: 'American Samoa' },
  { id: 'cook-islands', name: 'Cook Islands' },
  { id: 'federated-states-micronesia', name: 'Federated States of Micronesia' },
  { id: 'fiji', name: 'Fiji' },
  { id: 'french-polynesia', name: 'French Polynesia' },
  { id: 'guam', name: 'Guam' },
  { id: 'kiribati', name: 'Kiribati' },
  { id: 'marshall-islands', name: 'Marshall Islands' },
  { id: 'nauru', name: 'Nauru' },
  { id: 'new-caledonia', name: 'New Caledonia' },
  { id: 'niue', name: 'Niue' },
  { id: 'northern-mariana-islands', name: 'Northern Mariana Islands' },
  { id: 'palau', name: 'Palau' },
  { id: 'papua-new-guinea', name: 'Papua New Guinea' },
  { id: 'pitcairn', name: 'Pitcairn' },
  { id: 'samoa', name: 'Samoa' },
  { id: 'solomon-islands', name: 'Solomon Islands' },
  { id: 'tokelau', name: 'Tokelau' },
  { id: 'tonga', name: 'Tonga' },
  { id: 'tuvalu', name: 'Tuvalu' },
  { id: 'vanuatu', name: 'Vanuatu' },
  { id: 'wallis-and-futuna', name: 'Wallis And Futuna' },
]

interface SearchBarProps {
  onCountrySelect: (countryId: string) => void
}

export const SearchBar = ({ onCountrySelect }: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <img src={DEPLogo} alt='Digital Earth Pacific' className={styles.logo} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant='solid' size='2' className={styles.dropdownButton}>
            Select location for coastline data
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size='2' style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {pacificCountries.map((country) => (
            <DropdownMenu.Item key={country.id} onSelect={() => onCountrySelect(country.id)}>
              {country.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
