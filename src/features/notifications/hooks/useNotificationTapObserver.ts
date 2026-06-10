import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { pushDataSchema } from '../schemas/notificationSchema'
import { useOpenNotification } from './useOpenNotification'

// Tap num push do SO (background e cold start). O payload NÃO é confiável e
// não carrega type/id da notificação — o roteamento usa só os campos validados
// pelo zod: eventId → evento (pré-validado no backend), actor → perfil, e
// qualquer outra coisa cai na central. Nunca navega pra URL vinda do payload.
export function useNotificationTapObserver() {
  const router = useRouter()
  const { openTarget } = useOpenNotification()

  useEffect(() => {
    function handleResponse(response: Notifications.NotificationResponse) {
      const parsed = pushDataSchema.safeParse(
        response.notification.request.content.data,
      )
      if (parsed.success && parsed.data.eventId) {
        void openTarget({ kind: 'event', eventId: parsed.data.eventId })
      } else if (parsed.success && parsed.data.actor) {
        void openTarget({ kind: 'profile', userId: parsed.data.actor.id })
      } else {
        router.push('/notifications')
      }
    }

    // Cold start: o app foi aberto por um tap. O clear evita que uma abertura
    // normal futura re-processe o mesmo response (ele persiste entre sessões).
    const lastResponse = Notifications.getLastNotificationResponse()
    if (lastResponse) {
      Notifications.clearLastNotificationResponse()
      handleResponse(lastResponse)
    }

    const sub =
      Notifications.addNotificationResponseReceivedListener(handleResponse)
    return () => sub.remove()
  }, [openTarget, router])
}
