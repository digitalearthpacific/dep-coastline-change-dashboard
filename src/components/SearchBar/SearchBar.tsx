import { Button, DropdownMenu, Text } from '@radix-ui/themes'
import { useState, useEffect } from 'react'
import styles from './SearchBar.module.scss'
import DEPLogo from '../../assets/DEP-logo.jpg'
import { SEARCHBAR_INITIAL_VALUE } from '../../library/constants'
import { useMapData } from '../../hooks/useGlobalContext'
import usePrevious from '../../hooks/usePrevious'
import { getNameByCountryCode } from '../../library/utils'
import type { ContiguousHotspotProperties, CountryGeoJSONFeature } from '../../library/types'

export const SearchBar = ({
  handleHotspotDataChange,
  setShowAlert,
}: {
  handleHotspotDataChange: (hotspotData: ContiguousHotspotProperties | null) => void
  setShowAlert: (value: boolean) => void
}) => {
  const { selectedCountryFeature, countryApiData, updateCountrySelectAndSearchParam } = useMapData()
  const [dropdownValue, setDropdownValue] = useState<string>(SEARCHBAR_INITIAL_VALUE)
  const previousSelectedCountry = usePrevious(selectedCountryFeature)

  // Sync local dropdown value with global selected country
  useEffect(() => {
    if (selectedCountryFeature) {
      setDropdownValue(getNameByCountryCode(selectedCountryFeature))
    } else {
      setDropdownValue(SEARCHBAR_INITIAL_VALUE)
    }
  }, [selectedCountryFeature])

  const handleSelectCountry = (country: CountryGeoJSONFeature) => {
    const countryName = getNameByCountryCode(country)

    setDropdownValue(countryName)
    handleHotspotDataChange(null)
    updateCountrySelectAndSearchParam(country)

    if (previousSelectedCountry === null) {
      setShowAlert(true)
    }
  }

  return (
    <div className={styles.searchBar} element-hide-export='true'>
      <img src={DEPLogo} alt='Digital Earth Pacific' className={styles.logo} />
      <Text size='2'>Select a location to explore coastline changes</Text>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button className={styles.dropdownButton}>
            {dropdownValue}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.dropdownContent}>
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
