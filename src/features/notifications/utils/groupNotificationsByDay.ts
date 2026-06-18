import { isToday, isThisWeek } from 'date-fns'
import type { AppNotification } from '../schemas/notificationSchema'

export type NotificationSection = { title: string; data: AppNotification[] }

// Agrupa o feed (já vem do mais novo pro mais antigo) em Hoje · Esta semana ·
// Anteriores, sobre o createdAt. Client-side: não mexe no hook de paginação.
// Buckets vazios somem (só entram seções com itens).
export function groupNotificationsByDay(
  items: AppNotification[],
): NotificationSection[] {
  const today: AppNotification[] = []
  const week: AppNotification[] = []
  const older: AppNotification[] = []

  for (const item of items) {
    const date = new Date(item.createdAt)
    if (isToday(date)) today.push(item)
    // Semana começando na segunda (padrão do date-fns é domingo): no domingo,
    // o sábado recente fica em "Esta semana" em vez de cair em "Anteriores".
    else if (isThisWeek(date, { weekStartsOn: 1 })) week.push(item)
    else older.push(item)
  }

  return [
    { title: 'Hoje', data: today },
    { title: 'Esta semana', data: week },
    { title: 'Anteriores', data: older },
  ].filter(section => section.data.length > 0)
}
