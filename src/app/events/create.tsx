import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { EventForm } from '@/features/events/components/EventForm'
import { useCreateEvent } from '@/features/events/hooks/useCreateEvent'
import type { CreateEventInput } from '@/features/events/schemas/createEventSchema'

export default function CreateEventScreen() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateEvent()

  function handleSubmit(data: CreateEventInput) {
    mutate(data, {
      onSuccess: created => router.replace(`/events/${created.id}`),
    })
  }

  return (
    <View className="flex-1 bg-black">
      <EventForm
        onSubmit={handleSubmit}
        submitting={isPending}
        submitError={!!error}
        submitLabel="Criar evento"
        submittingLabel="Criando..."
        errorMessage="Não foi possível criar o evento. Tente novamente."
      />
    </View>
  )
}
