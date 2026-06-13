import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventAnalyticsService } from '../services/eventAnalyticsService'
import { analyticsKeys } from './cacheKeys'

// Disparado após o usuário concluir o compartilhamento (share sheet nativo).
// Fire-and-forget como o tracking de view; invalida as stats em sucesso.
export function useTrackEventShare(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      eventAnalyticsService.trackShare(eventId, new Date().toISOString()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: analyticsKeys.stats(eventId) }),
  })
}
