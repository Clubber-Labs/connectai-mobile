import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationsService } from '../services/conversationsService'
import { chatKeys } from './cacheKeys'
import type { MsgCache } from '../lib/realtimeCache'

function applyEdit(
  cache: MsgCache,
  messageId: string,
  content: string,
): MsgCache {
  return {
    ...cache,
    pages: cache.pages.map(page => ({
      ...page,
      data: page.data.map(m => (m.id === messageId ? { ...m, content } : m)),
    })),
  }
}

// Edição otimista: o conteúdo muda na hora; reverte em erro.
export function useEditMessage(conversationId: string) {
  const queryClient = useQueryClient()
  const key = chatKeys.messages(conversationId)

  return useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string
      content: string
    }) => conversationsService.editMessage(conversationId, messageId, content),
    onMutate: async ({ messageId, content }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<MsgCache>(key)
      queryClient.setQueryData<MsgCache>(key, old =>
        old ? applyEdit(old, messageId, content) : old,
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key })
      queryClient.invalidateQueries({ queryKey: chatKeys.inbox })
    },
  })
}
