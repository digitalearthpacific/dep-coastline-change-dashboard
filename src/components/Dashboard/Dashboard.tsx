import { MainMap } from '../MainMap'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <MainMap />
    </div>
  )
}
