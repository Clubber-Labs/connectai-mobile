import { View, Text, Pressable } from 'react-native'
import { useNavigateToProfile } from '@/features/users/hooks/useNavigateToProfile'
import { formatRelative } from '@/shared/utils/dateFormat'
import type { EventComment } from '@/shared/types'

type Props = {
  comment: EventComment
}

export function CommentItem({ comment }: Props) {
  const navigateToProfile = useNavigateToProfile()

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
      <View className="flex-row items-center justify-between mb-1">
        <Pressable
          onPress={() => navigateToProfile(comment.author.id)}
          accessibilityLabel={`Ver perfil de ${comment.author.username}`}
        >
          <Text className="text-sm font-semibold text-white">
            {comment.author.name} {comment.author.lastname}
          </Text>
        </Pressable>
        <Text className="text-xs text-zinc-500">
          {formatRelative(comment.createdAt)}
        </Text>
      </View>
      <Text className="text-sm text-zinc-200">{comment.content}</Text>
    </View>
  )
}
