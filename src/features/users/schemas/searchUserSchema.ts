import type { FollowStatus } from '@/shared/types'

export type SearchUserItemFull = {
  id: string
  username: string
  name: string
  lastname: string
  avatarUrl: string | null
  isPrivate: boolean
  bio: string | null
  followersCount: number
  followingCount: number
  createdAt: string
  followStatus: FollowStatus
}

export type SearchUserItemReduced = {
  id: string
  username: string
  name: string
  lastname: string
  avatarUrl: string | null
  isPrivate: true
  followStatus: FollowStatus
}

export type SearchUserItem = SearchUserItemFull | SearchUserItemReduced

// Discrimina via `followersCount` (presente sempre no Full, ausente no Reduced).
// `'bio' in u` falharia se o backend serializasse omitindo a chave quando bio=null.
export function hasFullProfile(u: SearchUserItem): u is SearchUserItemFull {
  return 'followersCount' in u
}
