import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useBanner } from '@/shared/lib/banner'
import { isNotFoundError, isForbiddenError } from '@/shared/lib/apiError'
import { eventsService } from '@/features/events/services/eventsService'
import { eventKeys } from '@/features/events/hooks/cacheKeys'
import type { AppNotification } from '../schemas/notificationSchema'
import { notificationTarget } from '../lib/notificationTarget'
import type { NotificationTarget } from '../lib/notificationTarget'
import { useMarkRead } from './useMarkRead'

// Abre o destino de uma notificação: marca como lida (otimista) e navega.
// Eventos são pré-validados no backend antes da navegação — alvo removido ou
// inacessível vira banner em vez de tela de erro; o fetch ainda aquece o cache
// da tela de destino. Perfis navegam direto (a tela trata erro).
export function useOpenNotification() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const showBanner = useBanner()
  const markRead = useMarkRead()

  const openTarget = useCallback(
    async (target: NotificationTarget | null) => {
      if (!target) return

      switch (target.kind) {
        case 'followRequests':
          router.push('/profile/follow-requests')
          return
        case 'profile':
          router.push(`/users/${target.userId}`)
          return
        case 'event':
          try {
            await queryClient.fetchQuery({
              queryKey: eventKeys.detail(target.eventId),
              queryFn: () => eventsService.getById(target.eventId),
            })
          } catch (err) {
            if (isNotFoundError(err) || isForbiddenError(err)) {
              showBanner('Esse conteúdo não está mais disponível.')
              return
            }
            // Erro de rede etc.: navega mesmo assim — a tela tem estado de erro.
          }
          router.push(`/events/${target.eventId}`)
          return
      }
    },
    [queryClient, router, showBanner],
  )

  const openNotification = useCallback(
    (n: AppNotification) => {
      if (n.readAt === null) markRead.mutate(n.id)
      void openTarget(notificationTarget(n))
    },
    [markRead, openTarget],
  )

  return { openNotification, openTarget }
}
