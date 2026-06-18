import { useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { colors } from '@/shared/theme'
import { MIN_QUERY_LENGTH } from '../hooks/useSuggestSpots'

// Espelha o max do contrato — corta no input, sem erro de validação depois.
const MAX_QUERY_LENGTH = 120

type Props = {
  value: string
  onChange: (text: string) => void
  editable?: boolean
}

// Texto livre da intenção. Quando preenchido, o backend ignora as preferências
// de rolê e busca por isto — o help abaixo deixa explícito.
export function SpotQueryInput({ value, onChange, editable = true }: Props) {
  // Foco realça a borda na cor da marca (sem glow) — sinaliza o campo ativo.
  const [focused, setFocused] = useState(false)
  // Só avisa o mínimo quando o usuário começou a digitar algo curto demais —
  // texto vazio é estado válido (cai nas preferências).
  const tooShort =
    value.trim().length > 0 && value.trim().length < MIN_QUERY_LENGTH

  return (
    <View className="gap-1.5">
      <Text className="text-content-tertiary text-sm font-medium">
        O que você quer fazer?{' '}
        <Text className="text-content-subtle text-xs">(opcional)</Text>
      </Text>
      <TextInput
        className={`border bg-surface rounded-xl px-4 py-3.5 text-base text-content ${
          focused ? 'border-brand' : 'border-line'
        }`}
        placeholder="bar com música ao vivo"
        placeholderTextColor={colors.contentSubtle}
        value={value}
        onChangeText={onChange}
        editable={editable}
        maxLength={MAX_QUERY_LENGTH}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {tooShort ? (
        <Text className="text-content-subtle text-xs">
          Descreva com pelo menos {MIN_QUERY_LENGTH} caracteres.
        </Text>
      ) : (
        <Text className="text-content-subtle text-xs">
          Se você descrever algo, buscamos por isso e ignoramos suas
          preferências.
        </Text>
      )}
    </View>
  )
}
