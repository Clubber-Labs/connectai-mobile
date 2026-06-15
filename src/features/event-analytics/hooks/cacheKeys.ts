export const analyticsKeys = {
  all: ['event-analytics'] as const,
  stats: (eventId: string) => ['event-analytics', eventId, 'stats'] as const,
}
