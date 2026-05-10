import { useInfiniteQuery } from '@tanstack/react-query'
import { followsService } from '../services/followsService'

export const followListKeys = {
  followers: (userId: string) => ['users', userId, 'followers'] as const,
  following: (userId: string) => ['users', userId, 'following'] as const,
}

export function useFollowers(userId: string) {
  return useInfiniteQuery({
    queryKey: followListKeys.followers(userId),
    queryFn: ({ pageParam }) =>
      followsService.followers(userId, { cursor: pageParam }),
    getNextPageParam: last => last.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!userId,
  })
}

export function useFollowing(userId: string) {
  return useInfiniteQuery({
    queryKey: followListKeys.following(userId),
    queryFn: ({ pageParam }) =>
      followsService.following(userId, { cursor: pageParam }),
    getNextPageParam: last => last.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!userId,
  })
}
