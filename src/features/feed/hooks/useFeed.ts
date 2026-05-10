import { useInfiniteQuery } from '@tanstack/react-query'
import { feedService } from '../services/feedService'
import type { EventStatus } from '@/shared/types'

type Filters = {
  status?: EventStatus[]
  category?: string[]
  dateFrom?: string
  dateTo?: string
  includePast?: boolean
}

export function useFeed(filters: Filters = {}) {
  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: ({ pageParam }) =>
      feedService.getFeed({ cursor: pageParam, ...filters }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? null,
  })
}
