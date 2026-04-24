import { View, Text, Animated } from 'react-native'

type Props = {
  current: number
  total: number
  progressWidth: Animated.AnimatedInterpolation<string>
}

export function RegisterProgressBar({ current, total, progressWidth }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-xs text-gray-400 text-right">{current + 1} de {total}</Text>
      <View className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <Animated.View className="h-full bg-blue-600 rounded-full" style={{ width: progressWidth }} />
      </View>
    </View>
  )
}
