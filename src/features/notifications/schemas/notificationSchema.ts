import { z } from 'zod'

// Contrato do backend (notification-shape.ts): campos ausentes vêm como null
// (Prisma) e datas como ISO string. Tipos inferidos daqui (regra do projeto).
export const NOTIFICATION_TYPES = [
  'EVENT_NEARBY',
  'FOLLOW_REQUEST',
  'FOLLOW_ACCEPTED',
  'NEW_FOLLOWER',
  'EVENT_INVITE',
  'EVENT_COMMENT',
  'POST_COMMENT',
  'EVENT_REACTION',
  'POST_REACTION',
  'COMMENT_REACTION',
  'EVENT_ATTENDANCE',
] as const

export const notificationTypeSchema = z.enum(NOTIFICATION_TYPES)

export const notificationActorSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  lastname: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullish(),
})

export const notificationSchema = z.object({
  id: z.uuid(),
  type: notificationTypeSchema,
  actorId: z.uuid().nullable(),
  eventId: z.uuid().nullable(),
  postId: z.uuid().nullable(),
  commentId: z.uuid().nullable(),
  title: z.string(),
  body: z.string(),
  // Varia por tipo: { actor } nas sociais, { eventId } na de proximidade.
  data: z
    .object({
      actor: notificationActorSchema.optional(),
      eventId: z.uuid().optional(),
    })
    .nullable(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
})

// Único frame que o WS /ws/notifications entrega.
export const notificationWsFrameSchema = z.object({
  type: z.literal('notification'),
  notification: notificationSchema,
})

// `data` do push do SO. O payload de um push NÃO é confiável (deep-link pode
// ser forjado) — só estes campos roteiam, depois de validados; o resto é
// ignorado. O push não carrega type/id da notificação (limitação do contrato).
export const pushDataSchema = z.object({
  eventId: z.uuid().optional(),
  actor: z.object({ id: z.uuid() }).optional(),
})

// "AppNotification" (e não "Notification") para não colidir com o tipo global
// de expo-notifications nos arquivos que importam os dois.
export type AppNotification = z.infer<typeof notificationSchema>
export type NotificationType = z.infer<typeof notificationTypeSchema>
export type NotificationActor = z.infer<typeof notificationActorSchema>
