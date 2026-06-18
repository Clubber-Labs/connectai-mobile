import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'
import type { NotificationType } from '../schemas/notificationSchema'

type IconName = ComponentProps<typeof Ionicons>['name']

// Tom semântico do selo/tile — a cor concreta vive no NotificationRow, pra
// manter este utilitário livre de presentation (className/hex).
export type NotificationTone = 'brand' | 'danger' | 'success' | 'warning'

export type NotificationVisual = { icon: IconName; tone: NotificationTone }

// Ícone + tom por tipo. Sociais (com actor) viram selo sobre o avatar; as de
// sistema (sem actor) viram tile de ícone. O ícone comunica a ação; o tom, a
// natureza — curtida = perigo, presença = sucesso, rolê expirando = aviso.
const VISUALS: Record<NotificationType, NotificationVisual> = {
  NEW_FOLLOWER: { icon: 'person-add', tone: 'brand' },
  FOLLOW_REQUEST: { icon: 'person-add', tone: 'brand' },
  FOLLOW_ACCEPTED: { icon: 'checkmark', tone: 'brand' },
  EVENT_INVITE: { icon: 'mail', tone: 'brand' },
  EVENT_COMMENT: { icon: 'chatbubble', tone: 'brand' },
  POST_COMMENT: { icon: 'chatbubble', tone: 'brand' },
  EVENT_REACTION: { icon: 'heart', tone: 'danger' },
  POST_REACTION: { icon: 'heart', tone: 'danger' },
  COMMENT_REACTION: { icon: 'heart', tone: 'danger' },
  EVENT_ATTENDANCE: { icon: 'checkmark-circle', tone: 'success' },
  EVENT_NEARBY: { icon: 'location', tone: 'brand' },
  SPOT_NEARBY: { icon: 'sparkles', tone: 'brand' },
  SPOT_JOIN: { icon: 'people', tone: 'brand' },
  SPOT_RENEWAL: { icon: 'time', tone: 'warning' },
}

export function notificationVisual(type: NotificationType): NotificationVisual {
  return VISUALS[type]
}
