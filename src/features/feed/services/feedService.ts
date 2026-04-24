import { api } from '@/shared/lib/api'
import type { CursorPaginatedResponse, FeedEvent } from '@/shared/types'

export const feedService = {
  getFeed: (cursor?: string): Promise<CursorPaginatedResponse<FeedEvent>> =>
    api
      .get('/feed', { params: { limit: 20, ...(cursor ? { cursor } : {}) } })
      .then(r => r.data),
}
