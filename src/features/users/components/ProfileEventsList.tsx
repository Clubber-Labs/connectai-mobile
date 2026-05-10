import type { ReactElement } from 'react'
import { Text, FlatList, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { UserEventCard } from './UserEventCard'
import type { UserEventSummary } from '@/shared/types'

type Props = {
  events: UserEventSummary[]
  header: ReactElement
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  emptyMessage?: string
}

export function ProfileEventsList({
  events,
  header,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  emptyMessage = 'Nenhum evento ainda.',
}: Props) {
  const router = useRouter()

  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <UserEventCard
          event={item}
          onPress={() => router.push(`/events/${item.id}`)}
        />
      )}
      ListEmptyComponent={
        <Text className="text-zinc-500 text-center mt-8">{emptyMessage}</Text>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color="#7c3aed" style={{ marginTop: 16 }} />
        ) : null
      }
      onEndReached={() => hasNextPage && onLoadMore()}
      onEndReachedThreshold={0.3}
    />
  )
}
