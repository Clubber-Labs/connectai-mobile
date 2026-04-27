import { View, Text, Pressable } from 'react-native'
import type { FeedEvent } from '@/shared/types'

type Props = {
  event: FeedEvent
  onPress: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function EventCard({ event, onPress }: Props) {
  const attendeeNames = event.attendances
    .slice(0, 3)
    .map(a => a.name)
    .join(', ')

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs text-gray-400">
          {event.author.name} {event.author.lastname}
        </Text>
        {!event.isPublic && (
          <View className="bg-gray-100 rounded-full px-2 py-0.5">
            <Text className="text-xs text-gray-500">Privado</Text>
          </View>
        )}
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-1">
        {event.title}
      </Text>
      <Text className="text-sm text-gray-500 mb-3">
        {formatDate(event.createdAt)}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-4">
          <Text className="text-xs text-gray-400">
            {event._count.attendances} presença
            {event._count.attendances !== 1 ? 's' : ''}
          </Text>
          <Text className="text-xs text-gray-400">
            {event._count.comments} comentário
            {event._count.comments !== 1 ? 's' : ''}
          </Text>
          <Text className="text-xs text-gray-400">
            {event._count.reactions} reação
            {event._count.reactions !== 1 ? 'ões' : ''}
          </Text>
        </View>
      </View>

      {attendeeNames.length > 0 && (
        <Text className="text-xs text-blue-500 mt-2">
          {attendeeNames} {event.attendances.length === 1 ? 'vai' : 'vão'}
        </Text>
      )}
    </Pressable>
  )
}
