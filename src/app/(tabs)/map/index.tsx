import { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import Mapbox from '@rnmapbox/maps'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useEventsList } from '@/features/events/hooks/useEvents'
import { formatEventDate } from '@/shared/utils/dateFormat'
import type { FeedEvent } from '@/shared/types'

const BRAZIL_CENTER: [number, number] = [-47.9292, -15.7801]
const BRAZIL_ZOOM = 4
const USER_ZOOM = 13
const ALL_CATEGORIES = 'Todas'

export default function MapScreen() {
  const router = useRouter()
  const cameraRef = useRef<Mapbox.Camera>(null)
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<FeedEvent | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES)

  const { data, isLoading } = useEventsList(50)

  const events = useMemo(
    () =>
      (data?.data ?? []).filter(
        e => typeof e.latitude === 'number' && typeof e.longitude === 'number',
      ),
    [data],
  )

  const categories = useMemo(() => {
    const set = new Set<string>()
    events.forEach(e => e.category && set.add(e.category))
    return [ALL_CATEGORIES, ...Array.from(set)]
  }, [events])

  const filteredEvents = useMemo(
    () =>
      activeCategory === ALL_CATEGORIES
        ? events
        : events.filter(e => e.category === activeCategory),
    [events, activeCategory],
  )

  useEffect(() => {
    let cancelled = false
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return
      const pos = await Location.getCurrentPositionAsync({})
      if (cancelled) return
      const coords: [number, number] = [
        pos.coords.longitude,
        pos.coords.latitude,
      ]
      setUserCoords(coords)
      cameraRef.current?.setCamera({
        centerCoordinate: coords,
        zoomLevel: USER_ZOOM,
        animationDuration: 800,
      })
    }
    getLocation()
    return () => {
      cancelled = true
    }
  }, [])

  function recenterOnUser() {
    if (!userCoords) return
    cameraRef.current?.setCamera({
      centerCoordinate: userCoords,
      zoomLevel: USER_ZOOM,
      animationDuration: 600,
    })
  }

  function handleMarkerPress(event: FeedEvent) {
    setSelectedEvent(event)
    cameraRef.current?.setCamera({
      centerCoordinate: [event.longitude, event.latitude],
      zoomLevel: USER_ZOOM,
      animationDuration: 500,
    })
  }

  return (
    <View className="flex-1 bg-black">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/dark-v11"
        scaleBarEnabled={false}
        compassEnabled={false}
        onPress={() => setSelectedEvent(null)}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={BRAZIL_ZOOM}
          centerCoordinate={BRAZIL_CENTER}
          animationMode="flyTo"
        />
        {filteredEvents.map(event => (
          <Mapbox.PointAnnotation
            key={event.id}
            id={`event-${event.id}`}
            coordinate={[event.longitude, event.latitude]}
            onSelected={() => handleMarkerPress(event)}
          >
            <View
              className={`w-9 h-9 rounded-full items-center justify-center border-2 ${
                selectedEvent?.id === event.id
                  ? 'bg-violet-400 border-white'
                  : 'bg-violet-600 border-white'
              }`}
            >
              <Ionicons name="calendar" size={16} color="#ffffff" />
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>

      <View className="absolute top-3 left-0 right-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          {categories.map(category => {
            const active = activeCategory === category
            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full border ${
                  active
                    ? 'bg-violet-600 border-violet-600'
                    : 'bg-zinc-900/90 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${active ? 'text-white' : 'text-zinc-200'}`}
                >
                  {category}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {isLoading && (
        <View className="absolute top-16 self-center bg-zinc-900/90 px-3 py-1.5 rounded-full border border-zinc-800">
          <ActivityIndicator size="small" color="#8b5cf6" />
        </View>
      )}

      {userCoords && (
        <Pressable
          onPress={recenterOnUser}
          className="absolute bottom-32 right-4 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center"
        >
          <Ionicons name="locate" size={22} color="#8b5cf6" />
        </Pressable>
      )}

      {selectedEvent && (
        <View className="absolute bottom-4 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text
                className="text-base font-bold text-white"
                numberOfLines={1}
              >
                {selectedEvent.title}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="calendar-outline" size={14} color="#a1a1aa" />
                <Text className="text-xs text-zinc-400">
                  {formatEventDate(selectedEvent.date)}
                </Text>
              </View>
              {selectedEvent.address && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Ionicons name="location-outline" size={14} color="#a1a1aa" />
                  <Text
                    className="text-xs text-zinc-400 flex-1"
                    numberOfLines={1}
                  >
                    {selectedEvent.address}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={() => setSelectedEvent(null)}
              className="w-7 h-7 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#a1a1aa" />
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push(`/events/${selectedEvent.id}`)}
            className="bg-violet-600 rounded-xl py-3 items-center"
          >
            <Text className="text-sm font-semibold text-white">
              Ver detalhes
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
