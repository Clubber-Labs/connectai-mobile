import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '../services/eventsService'
import type {
  CreateEventInput,
  CreateEventPayload,
} from '../schemas/createEventSchema'

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEventInput) => {
      const { endDate, ...rest } = data
      const payload: CreateEventPayload = {
        ...rest,
        date: data.date.toISOString(),
        description: data.description?.trim() || undefined,
        ...(endDate ? { endDate: endDate.toISOString() } : {}),
      }
      return eventsService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
