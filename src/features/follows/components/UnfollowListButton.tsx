import { Pressable, Text, ActivityIndicator } from 'react-native'
import { useUnfollowFromList } from '../hooks/useUnfollowFromList'
import { useConfirm } from '@/shared/lib/confirm'

type Props = {
  viewerId: string
  targetId: string
  targetUsername: string
}

export function UnfollowListButton({
  viewerId,
  targetId,
  targetUsername,
}: Props) {
  const unfollow = useUnfollowFromList(viewerId)
  const confirm = useConfirm()

  async function handlePress() {
    const ok = await confirm({
      title: 'Deixar de seguir',
      message: `Deseja deixar de seguir @${targetUsername}?`,
      confirmLabel: 'Deixar de seguir',
      destructive: true,
    })
    if (ok) unfollow.mutate(targetId)
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={unfollow.isPending}
      className="px-3 py-1.5 rounded-lg border border-zinc-700"
      accessibilityLabel={`Deixar de seguir @${targetUsername}`}
    >
      {unfollow.isPending ? (
        <ActivityIndicator size="small" color="#a1a1aa" />
      ) : (
        <Text className="text-zinc-200 text-xs font-semibold">Seguindo</Text>
      )}
    </Pressable>
  )
}
