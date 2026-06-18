import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Rótulo curto de dia para a roda de data+hora: "Hoje" / "Amanhã" para os dias
// próximos, senão "qua, 24 jun". Abreviações montadas à mão pra caber na coluna
// sem cortar — o token EEE do date-fns vinha com o nome do dia por extenso.
const WHEEL_WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const WHEEL_MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

export function formatWheelDay(date: Date): string {
  if (isToday(date)) return 'Hoje'
  if (isTomorrow(date)) return 'Amanhã'
  return `${WHEEL_WEEKDAYS[date.getDay()]}, ${date.getDate()} ${WHEEL_MONTHS[date.getMonth()]}`
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR })
}

export function formatEventDate(iso: string): string {
  return format(new Date(iso), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm', { locale: ptBR })
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy', { locale: ptBR })
}

// dd/MM/yyyy para datas date-only (YYYY-MM-DD). Usa parse local (evita o
// off-by-one de fusos negativos, como BRT) e tolera valor ausente/inválido — a
// timeline de analytics pode vir parcial enquanto o backend está em ajuste.
export function formatDayMonthYear(isoDate: string): string {
  if (!isoDate) return ''
  const date = parseLocalDate(isoDate)
  return Number.isNaN(date.getTime())
    ? isoDate
    : format(date, 'dd/MM/yyyy', { locale: ptBR })
}

// `new Date('YYYY-MM-DD')` é interpretado como UTC; em fusos negativos vira
// o dia anterior no horário local. Use estes helpers pra campos date-only.
export function parseLocalDate(iso: string): Date {
  const [datePart] = iso.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toLocalIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}
