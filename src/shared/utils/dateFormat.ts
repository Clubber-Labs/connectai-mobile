import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR })
}

export function formatEventDate(iso: string): string {
  return format(new Date(iso), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Parseia uma string ISO interpretando a parte da data (YYYY-MM-DD) como
 * local. Evita o shift de fuso típico do `new Date('YYYY-MM-DD')`, que o JS
 * interpreta como UTC midnight — em UTC-3 isso vira o dia anterior. Use pra
 * campos "date-only" (data de nascimento, vencimento) onde o horário não importa.
 */
export function parseLocalDate(iso: string): Date {
  const [datePart] = iso.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Serializa uma Date para `YYYY-MM-DD` usando os componentes locais.
 * Evita o shift de `date.toISOString().split('T')[0]`, que converte pra UTC
 * antes — em fusos positivos (UTC+X) midnight local pode virar dia anterior.
 */
export function toLocalIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
