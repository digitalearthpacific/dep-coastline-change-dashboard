import { useContext } from 'react'
import { MapDataContext } from '../contexts/MapDataContext'
import { MapVisualizationContext } from '../contexts/MapVisualizationContext'

export const useMapData = () => {
  const context = useContext(MapDataContext)
  if (context === undefined) {
    throw new Error('useMapData must be used within a MapDataProvider')
  }
  return context
}

export const useMapVisualization = () => {
  const context = useContext(MapVisualizationContext)
  if (context === undefined) {
    throw new Error('useMapVisualization must be used within a MapVisualizationProvider')
  }
  return context
}
