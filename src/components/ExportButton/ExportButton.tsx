import { useCallback, useState } from 'react'

import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'

import { useMapData } from '../../hooks/useGlobalContext'
import { DownloadIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu } from '@radix-ui/themes'
import { EXPORT_CLASS_NAME } from '../../library/constants'
import styles from './ExportButton.module.scss'
import useResponsive from '../../hooks/useResponsive'
import { getNameByCountryCode } from '../../library/utils'

export const ExportButton = () => {
  const { isMobileWidth } = useResponsive()
  const [isExporting, setIsExporting] = useState(false)
  const { selectedCountryFeature } = useMapData()

  const countryName = selectedCountryFeature ? getNameByCountryCode(selectedCountryFeature) : '-'

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

  const createDownloadFileName = useCallback(
    (extension: 'pdf' | 'jpg') => {
      return `${countryName}-coastline-results.${extension}`
    },
    [countryName],
  )

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
    !isMobileWidth && (
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
    )
  )
}
