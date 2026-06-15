import { useMutation } from '@tanstack/react-query'
import { spotsService } from '../services/spotsService'
import type { SpotSuggestionsParams } from '../types'

// Geração consome quota diária (429 quando estoura) — sem retry e o caller
// desabilita o botão via isPending (lock contra double-tap).
export function useGenerateSuggestions() {
  return useMutation({
    mutationFn: (params: SpotSuggestionsParams) =>
      spotsService.generateSuggestions(params),
    retry: false,
  })
}
