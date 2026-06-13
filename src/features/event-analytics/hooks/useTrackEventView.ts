import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventAnalyticsService } from '../services/eventAnalyticsService'
import { analyticsKeys } from './cacheKeys'

// Tracking é fire-and-forget: nenhum feedback de UI em falha (o backend decide
// como registrar). Em sucesso, invalida as stats pro autor ver o número novo na
// próxima abertura do dashboard.
export function useTrackEventView(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      eventAnalyticsService.trackView(eventId, new Date().toISOString()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: analyticsKeys.stats(eventId) }),
  })
}
