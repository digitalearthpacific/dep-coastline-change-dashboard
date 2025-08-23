import { Button, DropdownMenu } from '@radix-ui/themes'
import { useState, useEffect } from 'react'
import styles from './SearchBar.module.scss'
import DEPLogo from '../../assets/DEP-logo.jpg'
import { NONE_VALUE, SEARCHBAR_INITIAL_VALUE } from '../../library/constants'
import { useChart, useCountry } from '../../hooks/useGlobalContext'
import { getNameByCountryCode } from '../../library/utils/getNameByCountryCode'
import type { CountryGeoJSONFeature } from '../../library/types/countryGeoJsonTypes'

export const SearchBar = () => {
  const { selectedCountryFeature, countryApiData, updateCountrySelectAndSearchParam } = useCountry()
  const { resetChartDefaultSettings } = useChart()
  const [dropdownValue, setDropdownValue] = useState<string>(SEARCHBAR_INITIAL_VALUE)

  // Sync local dropdown value with global selected country
  useEffect(() => {
    if (selectedCountryFeature) {
      setDropdownValue(getNameByCountryCode(selectedCountryFeature))
    } else {
      setDropdownValue(SEARCHBAR_INITIAL_VALUE)
    }
  }, [selectedCountryFeature])

  const handleSelectNone = () => {
    setDropdownValue(SEARCHBAR_INITIAL_VALUE)
    updateCountrySelectAndSearchParam(null)
    resetChartDefaultSettings()
  }

  const handleSelectCountry = (country: CountryGeoJSONFeature) => {
    const countryName = getNameByCountryCode(country)

    setDropdownValue(countryName)
    updateCountrySelectAndSearchParam(country)
  }

  return (
    <div className={styles.searchBar}>
      <img src={DEPLogo} alt='Digital Earth Pacific' className={styles.logo} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button className={styles.dropdownButton}>
            {dropdownValue}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.dropdownContent}>
          <DropdownMenu.Item key={NONE_VALUE} onSelect={handleSelectNone}>
            None
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {countryApiData.map((country) => (
            <DropdownMenu.Item
              key={country.properties.id}
              onSelect={() => handleSelectCountry(country)}
            >
              {getNameByCountryCode(country)}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
