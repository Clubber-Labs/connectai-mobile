import { View, Text, Pressable } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import { UserAvatar } from '@/shared/components/UserAvatar'
import type { Spot } from '../types'

type Props = {
  spots: Spot[]
  selectedId?: string
  onPress: (spot: Spot) => void
  // Semi-transparente quando a densidade (heatmap) está visível por baixo.
  dimmed?: boolean
}

const BALLOON_SIZE = 48
const BALLOON_SIZE_SELECTED = 58
const TAIL_SIZE = 10
const DIMMED_OPACITY = 0.5

// Balão do spot: foto de perfil do criador com borda violeta + badge de
// membros. O rabinho embaixo diferencia visualmente dos pins de evento
// (borda branca, capa do banner).
function SpotBalloon({ spot, size }: { spot: Spot; size: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 3,
          borderColor: '#8b5cf6',
          backgroundColor: '#0a0a0a',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UserAvatar
          name={`${spot.creator.name} ${spot.creator.lastname}`}
          avatarUrl={spot.creator.avatarUrl}
          size={size - 8}
        />
        {spot.memberCount > 1 && (
          <View
            style={{ position: 'absolute', top: -6, right: -6 }}
            className="bg-violet-600 rounded-full min-w-[20px] h-5 px-1 items-center justify-center border border-black"
          >
            <Text className="text-white text-[10px] font-bold">
              {spot.memberCount}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: TAIL_SIZE / 2,
          borderRightWidth: TAIL_SIZE / 2,
          borderTopWidth: TAIL_SIZE,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#8b5cf6',
          marginTop: -1,
        }}
      />
    </View>
  )
}

export function SpotMarkers({ spots, selectedId, onPress, dimmed }: Props) {
  return (
    <>
      {spots.map(spot => {
        const selected = selectedId === spot.id
        const size = selected ? BALLOON_SIZE_SELECTED : BALLOON_SIZE
        return (
          <Mapbox.MarkerView
            key={spot.id}
            id={`spot-${spot.id}`}
            coordinate={[spot.longitude, spot.latitude]}
            // Âncora na ponta do rabinho — o balão "aponta" pro lugar.
            anchor={{ x: 0.5, y: 1 }}
            allowOverlap
          >
            <View style={{ opacity: dimmed ? DIMMED_OPACITY : 1 }}>
              <Pressable
                onPress={() => onPress(spot)}
                accessibilityRole="button"
                accessibilityLabel={`Ver spot ${spot.title}`}
                hitSlop={6}
              >
                <SpotBalloon spot={spot} size={size} />
              </Pressable>
            </View>
          </Mapbox.MarkerView>
        )
      })}
    </>
  )
}
