import { ScrollView, View } from 'react-native'
import { Chip } from '@/shared/components/Chip'
import type { EventStatus } from '@/shared/types'

type Option = {
  value: EventStatus
  label: string
}

// Ordem do mais "atual" pro mais antigo — facilita scan visual.
const OPTIONS: Option[] = [
  { value: 'ONGOING', label: 'Acontecendo' },
  { value: 'SOON', label: 'Em breve' },
  { value: 'UPCOMING', label: 'Futuros' },
  { value: 'PAST', label: 'Encerrados' },
]

type Props = {
  value: EventStatus[]
  onChange: (next: EventStatus[]) => void
  // Quebra em linhas (flex-wrap) em vez do scroll horizontal — para o sheet de
  // filtros do mapa, onde os chips ficam empilhados com os de categoria.
  wrap?: boolean
}

export function EventStatusFilter({ value, onChange, wrap }: Props) {
  function toggle(status: EventStatus) {
    const next = value.includes(status)
      ? value.filter(s => s !== status)
      : [...value, status]
    // Ordena pela ordem canônica do OPTIONS pra evitar queryKeys duplicadas
    // (ex: [SOON, ONGOING] ≠ [ONGOING, SOON] no hash do react-query).
    onChange(OPTIONS.map(o => o.value).filter(s => next.includes(s)))
  }

  const chips = OPTIONS.map(option => (
    <Chip
      key={option.value}
      label={option.label}
      active={value.includes(option.value)}
      onPress={() => toggle(option.value)}
    />
  ))

  if (wrap) {
    return <View className="flex-row flex-wrap gap-2">{chips}</View>
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
    >
      {chips}
    </ScrollView>
  )
}
