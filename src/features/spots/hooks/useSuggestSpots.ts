import { useState } from 'react'
import {
  useConsentStore,
  selectCanUseLocation,
} from '@/features/privacy/store/consentStore'
import { getForegroundLocation } from '../lib/foregroundLocation'
import { useGenerateSuggestions } from './useGenerateSuggestions'

export type LocationIssue = 'denied' | 'error' | null

// Orquestra o fluxo do botão "gerar": gate de consentimento (LGPD) → posição
// foreground capturada NA HORA do tap (minimização: nada de stream/persistir)
// → mutation. O lock anti double-tap é o isPending da mutation — a quota
// diária não pode ser queimada por toque duplo.
export function useSuggestSpots() {
  // Gate LGPD: sem consentimento de localização precisa, nem pede a permissão
  // do SO — a tela mostra o caminho pras configurações de privacidade.
  const hasLocationConsent = useConsentStore(selectCanUseLocation)
  const generate = useGenerateSuggestions()
  const [locationIssue, setLocationIssue] = useState<LocationIssue>(null)

  async function handleGenerate() {
    if (generate.isPending || !hasLocationConsent) return
    setLocationIssue(null)
    const location = await getForegroundLocation()
    if (location.kind !== 'granted') {
      setLocationIssue(location.kind)
      return
    }
    generate.mutate({
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }

  return {
    hasLocationConsent,
    suggestions: generate.data?.suggestions ?? [],
    remaining: generate.data?.remaining,
    isGenerating: generate.isPending,
    generateError: generate.error,
    locationIssue,
    handleGenerate,
  }
}
