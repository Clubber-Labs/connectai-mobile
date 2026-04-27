import { useCallback, useRef, useState } from 'react'
import { BRAZIL_ZOOM, MARKERS_ZOOM_THRESHOLD } from '../constants'

/**
 * Mantém o zoom contínuo num ref (sem re-render por tick) e expõe apenas
 * `showMarkers` como state — só atualiza quando cruza o threshold.
 */
export function useMapZoomState() {
  const zoomRef = useRef<number>(BRAZIL_ZOOM)
  const [showMarkers, setShowMarkers] = useState(
    BRAZIL_ZOOM >= MARKERS_ZOOM_THRESHOLD,
  )

  const onCameraZoomChange = useCallback((zoom: number) => {
    zoomRef.current = zoom
    const next = zoom >= MARKERS_ZOOM_THRESHOLD
    setShowMarkers(prev => (prev === next ? prev : next))
  }, [])

  const getZoom = useCallback(() => zoomRef.current, [])

  return { showMarkers, onCameraZoomChange, getZoom }
}
