import { MainMap } from '../MainMap'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mapSection}>
        <MainMap />
      </div>
      {/* <div className={styles.rightPanel}>
        <div className={styles.panelHeader}>
          <h2>Coastline Analysis</h2>
        </div>
        <div className={styles.panelContent}>
          <p>This is the right panel content area.</p>
          <p>You can add charts, data tables, controls, or other components here.</p>
        </div>
      </div> */}
    </div>
  )
}
