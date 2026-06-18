// Janelas pré-prontas pro horário do spot (teto de 24h). Decisão pura: recebe o
// "agora" e devolve início/fim; o form aplica via setValue. 'custom' devolve
// null — aí o usuário escolhe nos date-pickers. O schema revalida no submit.

export type SpotTimePreset = 'now2h' | 'tonight' | 'custom'

const HOUR_MS = 60 * 60 * 1000

function atHourToday(now: Date, hour: number): Date {
  const d = new Date(now)
  // setHours(24) rola pro dia seguinte às 0h — usado pra "meia-noite de hoje".
  d.setHours(hour, 0, 0, 0)
  return d
}

export function spotPresetWindow(
  preset: SpotTimePreset,
  now: Date,
): { startsAt: Date; endsAt: Date } | null {
  if (preset === 'now2h') {
    return { startsAt: now, endsAt: new Date(now.getTime() + 2 * HOUR_MS) }
  }
  if (preset === 'tonight') {
    // Começa às 20h (ou agora, se já passou) e termina à meia-noite. Se já é
    // tão tarde que a meia-noite não caberia (≤ início), cai pra início + 2h.
    const nightStart = atHourToday(now, 20)
    const startsAt = now.getTime() < nightStart.getTime() ? nightStart : now
    const midnight = atHourToday(now, 24)
    const endsAt =
      midnight.getTime() > startsAt.getTime()
        ? midnight
        : new Date(startsAt.getTime() + 2 * HOUR_MS)
    return { startsAt, endsAt }
  }
  return null
}
