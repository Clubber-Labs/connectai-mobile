import { useState } from 'react'
import { View, Text } from 'react-native'
import Slider from '@react-native-community/slider'
import { colors } from '@/shared/theme'

type Props = {
  label: string
  value: number
  min: number
  max: number
  onCommit: (km: number) => void
  disabled?: boolean
}

// Slider de raio em km, genérico (avisos de proximidade, busca de spots, etc.).
// Valor local enquanto arrasta (o label acompanha sem commit por tick); o commit
// acontece só no onSlidingComplete. Bounds e rótulo vêm por prop.
export function RadiusSlider({
  label,
  value,
  min,
  max,
  onCommit,
  disabled,
}: Props) {
  const [dragging, setDragging] = useState<number | null>(null)
  const shown = dragging ?? value

  return (
    <View className={disabled ? 'opacity-40' : undefined}>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-content">{label}</Text>
        <Text className="text-sm font-semibold text-brand-text">
          {shown} km
        </Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        disabled={disabled}
        onValueChange={setDragging}
        onSlidingComplete={km => {
          setDragging(null)
          onCommit(km)
        }}
        minimumTrackTintColor={colors.brand}
        maximumTrackTintColor={colors.line}
        thumbTintColor={colors.brandEmphasis}
      />
      <View className="flex-row justify-between">
        <Text className="text-xs text-content-faint">{min} km</Text>
        <Text className="text-xs text-content-faint">{max} km</Text>
      </View>
    </View>
  )
}
