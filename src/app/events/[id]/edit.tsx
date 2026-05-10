import { useEffect } from 'react'
import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { EventForm } from '@/features/events/components/EventForm'
import { useEvent } from '@/features/events/hooks/useEvents'
import { useUpdateEvent } from '@/features/events/hooks/useUpdateEvent'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { CreateEventInput } from '@/features/events/schemas/createEventSchema'
import type { EventDetail } from '@/shared/types'

function toDefaults(event: EventDetail): Partial<CreateEventInput> {
  return {
    title: event.title,
    description: event.description ?? '',
    date: new Date(event.date),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
    address: event.address ?? '',
    latitude: event.latitude,
    longitude: event.longitude,
    category: event.category,
    isPublic: event.isPublic,
  }
}

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const userId = useAuthStore(state => state.userId)
  const { data: event, isLoading, isError } = useEvent(id)
  const { mutate, isPending, error } = useUpdateEvent(id)

  // Não-autor não pode editar — redireciona pro detail.
  // Backend já bloqueia, mas evitamos UI inconsistente.
  useEffect(() => {
    if (event && userId && event.authorId !== userId) {
      router.replace(`/events/${id}`)
    }
  }, [event, userId, id, router])

  function handleSubmit(data: CreateEventInput) {
    mutate(data, {
      onSuccess: () => router.replace(`/events/${id}`),
    })
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    )
  }

  if (isError || !event) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6 gap-3">
        <Text className="text-zinc-200 text-center">
          Não foi possível carregar o evento.
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-violet-400 font-semibold">Voltar</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      <EventForm
        defaultValues={toDefaults(event)}
        onSubmit={handleSubmit}
        submitting={isPending}
        submitError={!!error}
        submitLabel="Salvar alterações"
        submittingLabel="Salvando..."
        errorMessage="Não foi possível salvar as alterações. Tente novamente."
      />
    </View>
  )
}
