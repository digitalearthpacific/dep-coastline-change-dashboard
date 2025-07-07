import { Button } from '@radix-ui/themes'
import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Coastline Change App</h1>
      <Button size="3" variant="solid">
        Get Started
      </Button>
    </div>
  )
}

export default App
