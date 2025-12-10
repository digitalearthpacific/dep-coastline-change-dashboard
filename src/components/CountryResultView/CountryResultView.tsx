import { useCallback, useState } from 'react'

import { Flex, Grid, Text, Button, DropdownMenu } from '@radix-ui/themes'
import { DownloadIcon } from '@radix-ui/react-icons'
import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'

import useResponsive from '../../hooks/useResponsive'
import { HotSpotsCard } from '../HotSpotsCard'
import { PopulationCard } from '../PopulationCard'
import { BuildingsCard } from '../BuildingsCard'
import { MangrovesCard } from '../MangrovesCard'
import { TextButton } from '../TextButton'
import { useMapData } from '../../hooks/useGlobalContext'
import styles from './CountryResultView.module.scss'
import { EXPORT_CLASS_NAME } from '../../library/constants'

type CountryResultViewProps = {
  goToBackgroundInfoView: () => void
  goToGlossaryView: () => void
}

export const CountryResultView = ({
  goToBackgroundInfoView,
  goToGlossaryView,
}: CountryResultViewProps) => {
  const { isMobileWidth } = useResponsive()
  const { contiguousHotspotFeatures } = useMapData()
  const [isExporting, setIsExporting] = useState(false)

  const totalPopulationFromHotspot = contiguousHotspotFeatures.reduce(
    (acc, feature) => acc + (feature.total_population ?? 0),
    0,
  )
  const numberOfBuildingsFromHotspot = contiguousHotspotFeatures.reduce(
    (acc, feature) => acc + (feature.building_counts ?? 0),
    0,
  )
  const mangroveAreaFromHotspot = contiguousHotspotFeatures.reduce(
    (acc, feature) => acc + (feature.mangrove_area_ha ?? 0),
    0,
  )

  const captureExportCanvas = useCallback(async () => {
    const exportTarget = document.getElementById('root')
    if (!exportTarget) return null

    const previousScrollX = window.scrollX
    const previousScrollY = window.scrollY

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    try {
      return await html2canvas(exportTarget, {
        backgroundColor: '#ffffff',
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        windowWidth: exportTarget.scrollWidth,
        windowHeight: exportTarget.scrollHeight,
        onclone: (clonedDocument) => {
          const clonedRoot = clonedDocument.getElementById('root')
          if (clonedRoot) {
            clonedRoot.classList.add(EXPORT_CLASS_NAME)
          }
        },
      })
    } finally {
      window.scrollTo({ top: previousScrollY, left: previousScrollX, behavior: 'auto' })
    }
  }, [])

  const createDownloadFileName = useCallback((extension: 'pdf' | 'jpg') => {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)

    return `dep-coastline-results-${timestamp}.${extension}`
  }, [])

  const handleExport = useCallback(
    async (format: 'pdf' | 'jpg') => {
      if (isExporting) return

      try {
        setIsExporting(true)

        const canvas = await captureExportCanvas()
        if (!canvas) return

        if (format === 'jpg') {
          const link = document.createElement('a')
          link.href = canvas.toDataURL('image/jpeg', 0.95)
          link.download = createDownloadFileName('jpg')
          link.click()
          link.remove()
          return
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait'
        const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4' })
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
        const renderWidth = canvas.width * ratio
        const renderHeight = canvas.height * ratio
        const offsetX = (pageWidth - renderWidth) / 2
        const offsetY = (pageHeight - renderHeight) / 2

        pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight)
        pdf.save(createDownloadFileName('pdf'))
      } catch (error) {
        console.error('Failed to export results', error)
      } finally {
        setIsExporting(false)
      }
    },
    [captureExportCanvas, createDownloadFileName, isExporting],
  )

  const handleExportPDF = useCallback(() => {
    void handleExport('pdf')
  }, [handleExport])

  const handleExportJPG = useCallback(() => {
    void handleExport('jpg')
  }, [handleExport])

  return (
    <>
      <Flex
        direction={isMobileWidth ? 'column-reverse' : 'row-reverse'}
        gap='4'
        py='3'
        align='center'
        element-hide-export='true'
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant='soft' color='gray'>
              EXPORT RESULTS
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className={styles.exportMenu}>
            <DropdownMenu.Item
              className={styles.exportMenuItem}
              onSelect={handleExportPDF}
              disabled={isExporting}
            >
              PDF
              <DownloadIcon />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={styles.exportMenuItem}
              onSelect={handleExportJPG}
              disabled={isExporting}
            >
              JPG
              <DownloadIcon />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <TextButton ariaLabel='View Glossary' onClick={goToGlossaryView}>
          GLOSSARY
        </TextButton>
        <TextButton ariaLabel='View Background Information' onClick={goToBackgroundInfoView}>
          VIEW BACKGROUND INFORMATION
        </TextButton>
      </Flex>
      <Grid columns='1'>
        <HotSpotsCard />
      </Grid>
      <Flex direction='column' gap='1' justify='between'>
        <Text as='div' size={isMobileWidth ? '4' : '5'} weight='bold'>
          Key Statistics
        </Text>
        <Text as='div' size={isMobileWidth ? '2' : '3'} color='gray'>
          These numbers show the population, buildings, and mangroves currently visible on the map.
          They update as you pan or zoom the map to provide insights into your selected location.
        </Text>
      </Flex>
      <Grid columns={isMobileWidth ? '1' : '3'} gap='4'>
        <PopulationCard totalPopulation={totalPopulationFromHotspot} />
        <BuildingsCard numberOfBuildings={numberOfBuildingsFromHotspot} />
        <MangrovesCard mangroveArea={mangroveAreaFromHotspot} />
      </Grid>
    </>
  )
}
