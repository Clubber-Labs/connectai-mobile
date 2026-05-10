import { Button } from '@/shared/components/Button'
import { useConfirm } from '@/shared/lib/confirm'
import type { FollowStatus } from '@/shared/types'

type Props = {
  status: FollowStatus
  loading?: boolean
  onFollow: () => void
  onUnfollow: () => void
}

export function FollowButton({ status, loading, onFollow, onUnfollow }: Props) {
  const confirm = useConfirm()

  async function handlePress() {
    if (status === 'ACCEPTED') {
      const ok = await confirm({
        title: 'Deixar de seguir',
        message: 'Tem certeza que deseja deixar de seguir?',
        confirmLabel: 'Deixar de seguir',
        destructive: true,
      })
      if (ok) onUnfollow()
      return
    }
    if (status === 'PENDING') {
      const ok = await confirm({
        title: 'Cancelar solicitação',
        message: 'Deseja cancelar o pedido de seguir?',
        confirmLabel: 'Cancelar pedido',
        cancelLabel: 'Não',
        destructive: true,
      })
      if (ok) onUnfollow()
      return
    }
    onFollow()
  }

  const label =
    status === 'ACCEPTED'
      ? 'Seguindo'
      : status === 'PENDING'
        ? 'Solicitado'
        : 'Seguir'
  const variant = status === null ? 'primary' : 'secondary'

  return (
    <Button
      label={label}
      onPress={handlePress}
      loading={loading}
      variant={variant}
    />
  )
}
