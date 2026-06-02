import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

type Coords = [number, number]
export type LocationStatus =
  | 'loading'
  | 'disabled'
  | 'denied'
  | 'error'
  | 'ready'

type Options = {
  enabled?: boolean
}

type Result = {
  coords: Coords | null
  status: LocationStatus
}

export function useUserLocation({ enabled = true }: Options = {}): Result {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [status, setStatus] = useState<LocationStatus>(
    enabled ? 'loading' : 'disabled',
  )

  useEffect(() => {
    let cancelled = false

    if (!enabled) {
      setCoords(null)
      setStatus('disabled')
      return () => {
        cancelled = true
      }
    }

    async function load() {
      try {
        setStatus('loading')
        const permission = await Location.requestForegroundPermissionsAsync()
        if (cancelled) return
        if (permission.status !== 'granted') {
          setStatus('denied')
          return
        }
        const pos = await Location.getCurrentPositionAsync({})
        if (cancelled) return
        setCoords([pos.coords.longitude, pos.coords.latitude])
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { coords, status }
}
