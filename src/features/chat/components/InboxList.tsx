import {
  FlatList,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useInbox } from '../hooks/useInbox'
import { useDeleteConversation } from '../hooks/useDeleteConversation'
import { usePullRefresh } from '@/shared/hooks/usePullRefresh'
import { useConfirm } from '@/shared/lib/confirm'
import { SwipeableRow } from '@/shared/components/SwipeableRow'
import { ConversationRow } from './ConversationRow'
import { InboxSkeleton } from './InboxSkeleton'
import { InboxEmpty } from './InboxEmpty'
import type { InboxItem } from '../types'

type Props = {
  myId: string
  onOpen: (id: string) => void
  onNew: () => void
}

export function InboxList({ myId, onOpen, onNew }: Props) {
  const {
    conversations,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInbox()
  const { refreshing, onRefresh } = usePullRefresh(refetch)
  const confirm = useConfirm()
  const del = useDeleteConversation()

  async function askDelete(item: InboxItem) {
    const ok = await confirm({
      title: 'Apagar conversa',
      message: 'Esta conversa será removida da sua lista de mensagens.',
      confirmLabel: 'Apagar',
      destructive: true,
    })
    if (ok) del.mutate(item.id)
  }

  if (isLoading) return <InboxSkeleton />

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-8 gap-3">
        <Text className="text-zinc-400 text-center">
          Não foi possível carregar as conversas.
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="border border-zinc-700 rounded-full px-5 py-2"
        >
          <Text className="text-violet-400 font-medium text-sm">
            Tentar de novo
          </Text>
        </Pressable>
      </View>
    )
  }

  if (conversations.length === 0) return <InboxEmpty onNew={onNew} />

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item: InboxItem) => item.id}
      renderItem={({ item }) => (
        <SwipeableRow
          rightActions={[
            { icon: 'trash', label: 'Apagar', onPress: () => askDelete(item) },
          ]}
        >
          <ConversationRow
            item={item}
            myId={myId}
            onPress={() => onOpen(item.id)}
          />
        </SwipeableRow>
      )}
      ItemSeparatorComponent={() => <View className="h-px bg-zinc-900 ml-20" />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#8b5cf6"
        />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
      }}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#8b5cf6" className="py-4" />
        ) : null
      }
    />
  )
}
