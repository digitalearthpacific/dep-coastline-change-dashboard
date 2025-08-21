import { Button, DropdownMenu, Spinner } from '@radix-ui/themes'
import styles from './SearchBar.module.scss'
import DEPLogo from '../../assets/DEP-logo.jpg'
import { NONE_VALUE } from '../../library/constants'
import { useChart, useCountry } from '../../hooks/useGlobalContext'
import { getNameByCountryCode } from '../../library/utils/getNameByCountryCode'

export const SearchBar = ({ isLoading }: { isLoading: boolean }) => {
  const { selectedCountryFeature, countryApiData, updateCountrySelectAndSearchParam } = useCountry()
  const { resetChartDefaultSettings } = useChart()

  const handleSelectNone = () => {
    updateCountrySelectAndSearchParam(null)
    resetChartDefaultSettings()
  }

  return (
    <div className={styles.searchBar}>
      <img src={DEPLogo} alt='Digital Earth Pacific' className={styles.logo} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button className={styles.dropdownButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size='1' />
                Loading locations...
              </>
            ) : selectedCountryFeature ? (
              getNameByCountryCode(selectedCountryFeature)
            ) : (
              'Select location for coastline data'
            )}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.dropdownContent}>
          {isLoading ? (
            <DropdownMenu.Item disabled>
              <Spinner size='1' />
              Loading locations...
            </DropdownMenu.Item>
          ) : (
            <>
              <DropdownMenu.Item key={NONE_VALUE} onSelect={handleSelectNone}>
                None
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              {countryApiData.map((country) => (
                <DropdownMenu.Item
                  key={country.properties.id}
                  onSelect={() => updateCountrySelectAndSearchParam(country)}
                >
                  {getNameByCountryCode(country)}
                </DropdownMenu.Item>
              ))}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
