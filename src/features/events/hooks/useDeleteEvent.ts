import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import { eventsService } from '../services/eventsService'
import { eventKeys, feedKey } from './cacheKeys'
import { userKeys } from '@/features/users/hooks/cacheKeys'
import { removeFromInfiniteList } from '@/shared/utils/infiniteList'
import type {
  CursorPaginatedResponse,
  EventDetail,
  FeedEvent,
  UserEventSummary,
} from '@/shared/types'

type FeedCache = InfiniteData<CursorPaginatedResponse<FeedEvent>>
type UserEventsCache = InfiniteData<CursorPaginatedResponse<UserEventSummary>>

// Optimistic remove em feed + lista do autor pra evitar flash do evento ainda
// presente após o delete (e clique em item já inexistente). Padrão canônico:
// CLAUDE.md → "Tratamento de erros e feedback".
export function useDeleteEvent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => eventsService.delete(id),
    onMutate: async () => {
      const event = queryClient.getQueryData<EventDetail>(eventKeys.detail(id))
      const authorId = event?.authorId

      await queryClient.cancelQueries({ queryKey: feedKey })
      const prevFeed = queryClient.getQueryData<FeedCache>(feedKey)
      queryClient.setQueryData<FeedCache>(feedKey, old =>
        removeFromInfiniteList(old, id),
      )

      let prevUserEvents: UserEventsCache | undefined
      if (authorId) {
        const userEventsKey = userKeys.events(authorId)
        await queryClient.cancelQueries({ queryKey: userEventsKey })
        prevUserEvents = queryClient.getQueryData<UserEventsCache>(userEventsKey)
        queryClient.setQueryData<UserEventsCache>(userEventsKey, old =>
          removeFromInfiniteList(old, id),
        )
      }

      return { authorId, prevFeed, prevUserEvents }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevFeed) queryClient.setQueryData(feedKey, ctx.prevFeed)
      if (ctx?.authorId && ctx.prevUserEvents) {
        queryClient.setQueryData(
          userKeys.events(ctx.authorId),
          ctx.prevUserEvents,
        )
      }
    },
    onSuccess: (_data, _vars, ctx) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) })
      if (ctx?.authorId) {
        queryClient.invalidateQueries({
          queryKey: userKeys.profile(ctx.authorId),
        })
        queryClient.invalidateQueries({ queryKey: userKeys.me })
      }
    },
    onSettled: (_data, _err, _vars, ctx) => {
      queryClient.invalidateQueries({ queryKey: feedKey })
      queryClient.invalidateQueries({ queryKey: eventKeys.list })
      if (ctx?.authorId) {
        queryClient.invalidateQueries({
          queryKey: userKeys.events(ctx.authorId),
        })
      }
    },
  })
}
