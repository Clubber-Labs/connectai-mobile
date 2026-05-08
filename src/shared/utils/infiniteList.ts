import type { InfiniteData } from '@tanstack/react-query'
import type { CursorPaginatedResponse } from '@/shared/types'

type Identified = { id: string }
type InfiniteCache<T> = InfiniteData<CursorPaginatedResponse<T>>

/**
 * Remove um item de um cache de `useInfiniteQuery` cursor-paginated.
 * Pura, type-safe — usar em `onMutate` de mutations de delete pra optimistic
 * remove (item some na hora; restaura via snapshot se backend falhar).
 *
 * Ver CLAUDE.md → "Tratamento de erros e feedback ao usuário".
 */
export function removeFromInfiniteList<T extends Identified>(
  cache: InfiniteCache<T> | undefined,
  itemId: string,
): InfiniteCache<T> | undefined {
  if (!cache) return cache
  return {
    ...cache,
    pages: cache.pages.map(page => ({
      ...page,
      data: page.data.filter(item => item.id !== itemId),
    })),
  }
}
