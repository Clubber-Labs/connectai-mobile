// Métricas agregadas do evento. Apenas as três do escopo (US015): visualizações,
// compartilhamentos e confirmações. CTA click, reach, impressões e origem de
// tráfego NÃO entram no mobile.
export type EventAnalyticsTotals = {
  views: number
  shares: number
  confirmations: number
}

// Ponto da série temporal (granularidade diária). `date` em ISO date-only
// (YYYY-MM-DD).
export type EventAnalyticsTimelinePoint = {
  date: string
  views: number
  shares: number
  confirmations: number
}

export type EventAnalyticsStats = {
  eventId: string
  // Quando o backend recomputou as métricas — usado pra exibir "Atualizado há…".
  updatedAt: string
  totals: EventAnalyticsTotals
  timeline: EventAnalyticsTimelinePoint[]
}
