import { MainMap } from '../MainMap'
import { SearchBar } from '../SearchBar'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
  const handleCountrySelect = (countryId: string) => {
    console.log('Selected country:', countryId)
    // TODO: Implement country selection logic
  }

  return (
    <div className={styles.dashboardContainer}>
      <SearchBar onCountrySelect={handleCountrySelect} />
      <MainMap />
    </div>
  )
}
