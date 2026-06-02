import { useRef } from 'react'
import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

export type SwipeAction = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
}

type Props = {
  children: ReactNode
  rightActions: SwipeAction[]
}

function RightActions({
  progress,
  actions,
  onRun,
}: {
  progress: SharedValue<number>
  actions: SwipeAction[]
  onRun: (action: SwipeAction) => void
}) {
  // Ícones (brancos, sem fundo) só aparecem quando o swipe está quase completo.
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.7, 1], [0, 1], Extrapolation.CLAMP),
  }))

  return (
    <Animated.View style={style} className="flex-row items-center">
      {actions.map(action => (
        <Pressable
          key={action.label}
          onPress={() => onRun(action)}
          style={{ width: 60 }}
          className="items-center justify-center"
          accessibilityLabel={action.label}
        >
          <Ionicons name={action.icon} size={22} color="#ffffff" />
        </Pressable>
      ))}
    </Animated.View>
  )
}

// Arraste a linha para a esquerda para revelar as ações — só os ícones, que
// surgem apenas no fim do gesto. Fecha o swipe antes de disparar a ação.
export function SwipeableRow({ children, rightActions }: Props) {
  const ref = useRef<SwipeableMethods>(null)

  function run(action: SwipeAction) {
    ref.current?.close()
    action.onPress()
  }

  return (
    <ReanimatedSwipeable
      ref={ref}
      friction={2}
      rightThreshold={48}
      overshootRight={false}
      renderRightActions={progress => (
        <RightActions progress={progress} actions={rightActions} onRun={run} />
      )}
    >
      {children}
    </ReanimatedSwipeable>
  )
}
