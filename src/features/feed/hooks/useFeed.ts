import { useInfiniteQuery } from '@tanstack/react-query'
import { feedService } from '../services/feedService'

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => feedService.getFeed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? null,
  })
}
