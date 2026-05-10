import { Modal, View, Text, Pressable } from 'react-native'

export type ConfirmOptions = {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

type Props = {
  visible: boolean
  options: ConfirmOptions
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  visible,
  options,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center px-8"
        onPress={onCancel}
      >
        <Pressable
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-full max-w-md gap-4"
          onPress={e => e.stopPropagation()}
        >
          <View className="gap-2">
            <Text className="text-white font-bold text-lg">
              {options.title}
            </Text>
            {!!options.message && (
              <Text className="text-zinc-300 text-sm leading-5">
                {options.message}
              </Text>
            )}
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 py-3 rounded-xl border border-zinc-700 items-center"
            >
              <Text className="text-zinc-200 font-semibold text-base">
                {options.cancelLabel ?? 'Cancelar'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className={`flex-1 py-3 rounded-xl items-center ${options.destructive ? 'bg-red-600' : 'bg-violet-600'}`}
            >
              <Text className="text-white font-semibold text-base">
                {options.confirmLabel ?? 'Confirmar'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
