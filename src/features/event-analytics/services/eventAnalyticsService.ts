import { api } from '@/shared/lib/api'
import type {
  EventAnalyticsStats,
  EventAnalyticsTimelinePoint,
  EventAnalyticsTotals,
} from '../types'

// O backend pode estar em ajuste e omitir campos. Normalizamos na fronteira do
// service pra forma estável (totais 0, timeline []) — a UI nunca lida com
// undefined nem quebra com payload parcial.
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {}
}

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

// updatedAt alimenta o "Atualizado há…" (formatRelative). String ausente ou
// não-parseável cairia em RangeError no date-fns — normaliza pra agora.
function isoOrNow(value: unknown): string {
  if (typeof value === 'string' && !Number.isNaN(new Date(value).getTime())) {
    return value
  }
  return new Date().toISOString()
}

function normalizeTotals(raw: unknown): EventAnalyticsTotals {
  const r = asRecord(raw)
  return {
    views: num(r.views),
    shares: num(r.shares),
    confirmations: num(r.confirmations),
  }
}

function normalizeTimeline(raw: unknown): EventAnalyticsTimelinePoint[] {
  if (!Array.isArray(raw)) return []
  return raw.map(point => {
    const p = asRecord(point)
    return {
      date: typeof p.date === 'string' ? p.date : '',
      views: num(p.views),
      shares: num(p.shares),
      confirmations: num(p.confirmations),
    }
  })
}

function normalizeStats(eventId: string, raw: unknown): EventAnalyticsStats {
  const r = asRecord(raw)
  return {
    eventId: typeof r.eventId === 'string' ? r.eventId : eventId,
    updatedAt: isoOrNow(r.updatedAt),
    totals: normalizeTotals(r.totals),
    timeline: normalizeTimeline(r.timeline),
  }
}

export const eventAnalyticsService = {
  // refresh=true força o backend a recomputar (botão "Atualizar"). Sem o flag,
  // o backend pode devolver o snapshot cacheado.
  getStats: (eventId: string, refresh = false): Promise<EventAnalyticsStats> =>
    api
      .get(`/events/${eventId}/stats`, {
        params: refresh ? { refresh: true } : undefined,
      })
      .then(r => normalizeStats(eventId, r.data)),

  trackView: (eventId: string, occurredAt: string): Promise<void> =>
    api
      .post(`/events/${eventId}/analytics/view`, { occurredAt })
      .then(() => undefined),

  trackShare: (eventId: string, occurredAt: string): Promise<void> =>
    api
      .post(`/events/${eventId}/analytics/share`, { occurredAt })
      .then(() => undefined),

  // CSV cru gerado pelo backend (colunas: data, visualizações, compartilhamentos,
  // confirmações). Mantido como texto pra repassar ao share sheet.
  exportCsv: (eventId: string): Promise<string> =>
    api
      .get(`/events/${eventId}/stats/export`, { responseType: 'text' })
      .then(r => (typeof r.data === 'string' ? r.data : String(r.data))),
}
