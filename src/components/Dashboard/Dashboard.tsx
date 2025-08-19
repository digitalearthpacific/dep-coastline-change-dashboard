import { useState } from 'react'

import { MainMap } from '../MainMap'
import { ResultPanel } from '../ResultPanel'
import { SearchBar } from '../SearchBar'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev)
  }

  const handleFullscreenExit = () => setIsFullscreen(false)

  return (
    <div className={styles.dashboardContainer}>
      {!isFullscreen && <SearchBar />}
      <MainMap
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        onFullscreenExit={handleFullscreenExit}
      />
      {!isFullscreen && <ResultPanel />}
    </div>
  )
}
