import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventAnalyticsService } from '../services/eventAnalyticsService'
import { analyticsKeys } from './cacheKeys'

// US015: dados frescos por 15 min ou via atualização manual. staleTime evita
// refetch redundante na janela; refetchInterval cobre o "atualizados a cada
// 15 minutos" enquanto o dashboard fica aberto.
const FIFTEEN_MINUTES = 1000 * 60 * 15

type Options = {
  // Só busca quando o usuário é autor + premium (evita 403 à toa). A decisão de
  // elegibilidade fica na tela, que conhece evento e perfil.
  enabled?: boolean
}

export function useEventAnalytics(
  eventId: string,
  { enabled = true }: Options = {},
) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: analyticsKeys.stats(eventId),
    queryFn: () => eventAnalyticsService.getStats(eventId),
    enabled: enabled && !!eventId,
    staleTime: FIFTEEN_MINUTES,
    refetchInterval: FIFTEEN_MINUTES,
  })

  // Atualização manual força o recomputo (refresh=true) e substitui o cache.
  // Separado do refetch automático (que usa refresh=false) pra expor um estado
  // de loading dedicado ao botão "Atualizar".
  const manualRefresh = useMutation({
    mutationFn: () => eventAnalyticsService.getStats(eventId, true),
    onSuccess: stats =>
      queryClient.setQueryData(analyticsKeys.stats(eventId), stats),
  })

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refresh: manualRefresh.mutate,
    isRefreshing: manualRefresh.isPending,
  }
}
