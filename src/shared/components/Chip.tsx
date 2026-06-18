import { Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/shared/theme'

type Props = {
  label: string
  active: boolean
  onPress: () => void
  disabled?: boolean
}

// Chip selecionável único do app — filtros (status/categorias), seletores de
// categoria/interesse, chips sobre o mapa. Ativo = fundo da marca + check;
// inativo = surface neutro. Forma padrão: rounded-lg. Quem agrupa decide o
// layout (scroll horizontal ou flex-wrap).
export function Chip({ label, active, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      className={`flex-row items-center gap-1 rounded-lg border px-3.5 py-2 ${
        active ? 'bg-brand border-brand' : 'bg-surface border-line-strong'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      {active && <Ionicons name="checkmark" size={14} color={colors.content} />}
      <Text
        className={`text-[13px] font-semibold ${
          active ? 'text-content' : 'text-content-tertiary'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  )
}
