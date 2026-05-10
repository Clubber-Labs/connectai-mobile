import { Pressable, Text, ActivityIndicator } from 'react-native'
import { useRemoveFollower } from '../hooks/useRemoveFollower'
import { useConfirm } from '@/shared/lib/confirm'

type Props = {
  viewerId: string
  followerId: string
  followerUsername: string
}

export function RemoveFollowerButton({
  viewerId,
  followerId,
  followerUsername,
}: Props) {
  const remove = useRemoveFollower(viewerId)
  const confirm = useConfirm()

  async function handlePress() {
    const ok = await confirm({
      title: 'Remover seguidor',
      message: `Deseja remover @${followerUsername} dos seus seguidores?`,
      confirmLabel: 'Remover',
      destructive: true,
    })
    if (ok) remove.mutate(followerId)
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={remove.isPending}
      className="px-3 py-1.5 rounded-lg border border-zinc-700"
      accessibilityLabel={`Remover @${followerUsername} dos seguidores`}
    >
      {remove.isPending ? (
        <ActivityIndicator size="small" color="#a1a1aa" />
      ) : (
        <Text className="text-zinc-200 text-xs font-semibold">Remover</Text>
      )}
    </Pressable>
  )
}
