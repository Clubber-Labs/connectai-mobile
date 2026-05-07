import { View, Pressable } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import type { FeedEvent } from '@/shared/types'
import { UserAvatar } from '@/shared/components/UserAvatar'
import { VIOLET_400, VIOLET_600 } from '../constants'
import { groupCoincidentEvents, fanoutOffset } from '../utils/markerLayout'

type Props = {
  events: FeedEvent[]
  selectedId?: string
  onPress: (event: FeedEvent) => void
}

const PIN_SIZE = 40
const PIN_SIZE_SELECTED = 52
const FANOUT_RADIUS = 30

export function EventMarkers({ events, selectedId, onPress }: Props) {
  const groups = groupCoincidentEvents(events)

  return (
    <>
      {groups.map(group =>
        group.map((event, index) => {
          const isSelected = selectedId === event.id
          const size = isSelected ? PIN_SIZE_SELECTED : PIN_SIZE
          const fullName = `${event.author.name} ${event.author.lastname}`.trim()
          const offset = fanoutOffset(index, group.length, FANOUT_RADIUS)

          return (
            <Mapbox.MarkerView
              key={event.id}
              id={`event-${event.id}`}
              coordinate={[event.longitude, event.latitude]}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap
            >
              <Pressable
                onPress={() => onPress(event)}
                accessibilityRole="button"
                accessibilityLabel={`Ver evento ${event.title}`}
                hitSlop={6}
                style={{
                  transform: [
                    { translateX: offset.x },
                    { translateY: offset.y },
                  ],
                }}
              >
                <View
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 3,
                    borderColor: isSelected ? VIOLET_400 : VIOLET_600,
                    backgroundColor: '#ffffff',
                    overflow: 'hidden',
                  }}
                >
                  <UserAvatar
                    name={fullName}
                    avatarUrl={event.author.avatarUrl}
                    size={size - 6}
                  />
                </View>
              </Pressable>
            </Mapbox.MarkerView>
          )
        }),
      )}
    </>
  )
}
