export type ApiError = {
  message: string
  statusCode: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type CursorPaginatedResponse<T> = {
  data: T[]
  nextCursor: string | null
}

export type FeedAuthor = {
  id: string
  name: string
  lastname: string
  username: string
}

export type FeedAttendee = {
  id: string
  name: string
  username: string
}

export type FeedEvent = {
  id: string
  title: string
  isPublic: boolean
  createdAt: string
  date: string
  author: FeedAuthor
  attendances: FeedAttendee[]
  _count: {
    attendances: number
    comments: number
    reactions: number
  }
}
