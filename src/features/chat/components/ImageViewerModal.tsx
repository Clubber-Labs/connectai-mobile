import { useEffect } from 'react'
import { Modal, View, Pressable, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  url: string | null
  onClose: () => void
}

const { width, height } = Dimensions.get('window')
// Distância vertical pra confirmar o "arrastar pra fechar".
const CLOSE_THRESHOLD = 120
// Distância de arraste em que o fundo chega à opacidade 0.
const FADE_DISTANCE = height * 0.6

export function ImageViewerModal({ url, onClose }: Props) {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const tx = useSharedValue(0)
  const ty = useSharedValue(0)
  const savedTx = useSharedValue(0)
  const savedTy = useSharedValue(0)
  // Opacidade do fundo preto — some conforme arrasta pra fechar.
  const bgOpacity = useSharedValue(1)

  // Reseta o transform a cada imagem aberta.
  useEffect(() => {
    scale.value = 1
    savedScale.value = 1
    tx.value = 0
    ty.value = 0
    savedTx.value = 0
    savedTy.value = 0
    bgOpacity.value = 1
  }, [url, scale, savedScale, tx, ty, savedTx, savedTy, bgOpacity])

  const pinch = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = Math.max(1, savedScale.value * e.scale)
    })
    .onEnd(() => {
      savedScale.value = scale.value
    })

  const pan = Gesture.Pan()
    .onUpdate(e => {
      if (scale.value > 1) {
        // Imagem ampliada: arrastar move dentro do enquadramento.
        tx.value = savedTx.value + e.translationX
        ty.value = savedTy.value + e.translationY
      } else {
        // Sem zoom: dismiss vertical. Trava o eixo X (gesto previsível) e só o
        // Y arrasta a imagem / esmaece o fundo.
        tx.value = 0
        ty.value = e.translationY
        bgOpacity.value = Math.max(0, 1 - Math.abs(e.translationY) / FADE_DISTANCE)
      }
    })
    .onEnd(e => {
      if (scale.value > 1) {
        savedTx.value = tx.value
        savedTy.value = ty.value
        return
      }
      if (Math.abs(e.translationY) > CLOSE_THRESHOLD) {
        // Passou do limiar → fecha (o Modal faz o fade de saída).
        runOnJS(onClose)()
      } else {
        // Não passou → volta ao centro e restaura o fundo.
        tx.value = withTiming(0)
        ty.value = withTiming(0)
        bgOpacity.value = withTiming(1)
      }
    })

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1)
      savedScale.value = 1
      tx.value = withTiming(0)
      ty.value = withTiming(0)
      savedTx.value = 0
      savedTy.value = 0
    })

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }))

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }))

  if (!url) return null

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1">
        <Animated.View
          className="absolute inset-0 bg-black"
          style={bgStyle}
          pointerEvents="none"
        />
        <GestureDetector gesture={composed}>
          <Animated.View className="flex-1 items-center justify-center">
            <Animated.Image
              source={{ uri: url }}
              style={[{ width, height: height * 0.82 }, animatedStyle]}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
        <Pressable
          onPress={onClose}
          className="absolute top-12 right-5 w-10 h-10 items-center justify-center bg-black/50 rounded-full"
          accessibilityLabel="Fechar imagem"
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </Pressable>
      </View>
    </Modal>
  )
}
