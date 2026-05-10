import { api } from '@/shared/lib/api'
import type { CursorPaginatedResponse, FeedAuthor } from '@/shared/types'

type ListParams = { limit?: number; cursor?: string }

const buildParams = ({ limit = 20, cursor }: ListParams) => ({
  limit,
  ...(cursor ? { cursor } : {}),
})

export const followsService = {
  follow: (userId: string) =>
    api.post(`/users/${userId}/follow`).then(r => r.data),

  unfollow: (userId: string) =>
    api.delete(`/users/${userId}/follow`).then(r => r.data),

  removeFollower: (followerId: string): Promise<void> =>
    api.delete(`/users/me/followers/${followerId}`).then(() => undefined),

  followers: (
    userId: string,
    params: ListParams = {},
  ): Promise<CursorPaginatedResponse<FeedAuthor>> =>
    api
      .get(`/users/${userId}/followers`, { params: buildParams(params) })
      .then(r => r.data),

  following: (
    userId: string,
    params: ListParams = {},
  ): Promise<CursorPaginatedResponse<FeedAuthor>> =>
    api
      .get(`/users/${userId}/following`, { params: buildParams(params) })
      .then(r => r.data),
}
