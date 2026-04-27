import { useQuery } from '@tanstack/react-query'
import { eventsService } from '../services/eventsService'

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsService.getById(id),
    enabled: !!id,
  })
}

export function useEventsList(limit = 50) {
  return useQuery({
    queryKey: ['events', 'list', limit],
    queryFn: () => eventsService.list({ limit }),
    staleTime: 1000 * 60,
  })
}
