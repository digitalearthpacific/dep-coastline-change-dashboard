import { Button, DropdownMenu } from '@radix-ui/themes'
import { useState, useEffect } from 'react'
import styles from './SearchBar.module.scss'
import DEPLogo from '../../assets/DEP-logo.jpg'
import { NONE_VALUE, SEARCHBAR_INITIAL_VALUE } from '../../library/constants'
import { useMapVisualization, useMapData } from '../../hooks/useGlobalContext'
import { usePrevious } from '../../hooks/usePrevious'
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
  const { resetStartAndEndDate } = useMapVisualization()
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

  const handleSelectNone = () => {
    setDropdownValue(SEARCHBAR_INITIAL_VALUE)
    handleHotspotDataChange(null)
    updateCountrySelectAndSearchParam(null)
    resetStartAndEndDate()
    setShowAlert(false)
  }

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
