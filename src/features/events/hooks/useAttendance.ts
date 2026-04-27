import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '../services/eventsService'
import type { AttendanceType } from '@/shared/types'
import { invalidateEventViews } from './cacheKeys'

export function useSetAttendance(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: AttendanceType) =>
      eventsService.setAttendance(eventId, type),
    onSuccess: () => invalidateEventViews(queryClient, eventId),
  })
}

export function useCancelAttendance(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => eventsService.cancelAttendance(eventId),
    onSuccess: () => invalidateEventViews(queryClient, eventId),
  })
}
