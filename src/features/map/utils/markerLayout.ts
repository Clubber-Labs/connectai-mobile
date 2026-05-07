import type { FeedEvent } from '@/shared/types'

const COINCIDENT_THRESHOLD = 0.0001

/**
 * Agrupa eventos que estão no mesmo (ou quase mesmo) local.
 * Eventos isolados aparecem em grupos de tamanho 1.
 */
export function groupCoincidentEvents(events: FeedEvent[]): FeedEvent[][] {
  const groups: FeedEvent[][] = []
  const consumed = new Set<string>()

  for (const event of events) {
    if (consumed.has(event.id)) continue
    const group: FeedEvent[] = [event]
    consumed.add(event.id)

    for (const other of events) {
      if (consumed.has(other.id)) continue
      if (
        Math.abs(other.longitude - event.longitude) < COINCIDENT_THRESHOLD &&
        Math.abs(other.latitude - event.latitude) < COINCIDENT_THRESHOLD
      ) {
        group.push(other)
        consumed.add(other.id)
      }
    }
    groups.push(group)
  }
  return groups
}

/**
 * Calcula o offset em pixels (na tela) de um marker dentro de um grupo
 * coincidente, espalhando-os em círculo. Para grupos de 1, retorna {0,0}.
 */
export function fanoutOffset(
  index: number,
  total: number,
  radius: number,
): { x: number; y: number } {
  if (total <= 1) return { x: 0, y: 0 }
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}
