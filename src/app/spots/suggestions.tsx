import { View, Text, FlatList, Linking, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { FormError } from '@/shared/components/FormError'
import { isValidationError } from '@/shared/lib/apiError'
import { useSuggestSpots } from '@/features/spots/hooks/useSuggestSpots'
import { suggestionsErrorMessage } from '@/features/spots/utils/suggestionsError'
import { SpotSuggestionCard } from '@/features/spots/components/SpotSuggestionCard'
import type { SpotSuggestion } from '@/features/spots/types'

const LOCATION_ISSUE_MESSAGES = {
  denied:
    'Permissão de localização negada. Ative nos ajustes do aparelho para gerar sugestões.',
  error: 'Não foi possível obter sua localização. Tente novamente.',
} as const

export default function SpotSuggestionsScreen() {
  const router = useRouter()
  const {
    hasLocationConsent,
    suggestions,
    remaining,
    isGenerating,
    generateError,
    locationIssue,
    handleGenerate,
  } = useSuggestSpots()

  function choose(suggestion: SpotSuggestion) {
    // Candidatos são efêmeros (não persistem no backend) — seguem por
    // parâmetro de rota até o form de publicação.
    router.push({
      pathname: '/spots/publish',
      params: { candidate: JSON.stringify(suggestion) },
    })
  }

  const hasResult = suggestions.length > 0

  const header = (
    <View className="gap-4 pb-5">
      <View className="gap-1">
        <Text className="text-white text-2xl font-bold">Bora pra onde?</Text>
        <Text className="text-zinc-400 text-sm">
          A IA sugere rolês em lugares perto de você, com base nas suas
          preferências. Escolha um, publique e chame a galera pro grupo.
        </Text>
      </View>

      {!hasLocationConsent ? (
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#a78bfa"
            />
            <Text className="text-zinc-200 text-sm font-semibold flex-1">
              Precisamos da sua localização
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm">
            Para sugerir rolês perto de você, ative o consentimento de
            localização precisa. Ela é usada só neste momento — nada de
            rastreamento em segundo plano.
          </Text>
          <Button
            label="Abrir configurações de privacidade"
            variant="secondary"
            onPress={() => router.push('/profile/privacy')}
          />
        </View>
      ) : (
        <View className="gap-2">
          <Button
            label={
              isGenerating
                ? 'Gerando sugestões...'
                : hasResult
                  ? 'Gerar novamente'
                  : 'Gerar sugestões'
            }
            onPress={handleGenerate}
            loading={isGenerating}
            disabled={isGenerating}
          />
          {remaining !== undefined && (
            <Text className="text-zinc-500 text-xs text-center">
              {remaining === 0
                ? 'Você usou todas as gerações de hoje.'
                : `${remaining} ${remaining === 1 ? 'geração restante' : 'gerações restantes'} hoje`}
            </Text>
          )}
          {locationIssue && (
            <>
              <FormError message={LOCATION_ISSUE_MESSAGES[locationIssue]} />
              {locationIssue === 'denied' && (
                <Pressable onPress={() => Linking.openSettings()}>
                  <Text className="text-violet-400 text-sm font-semibold text-center">
                    Abrir ajustes
                  </Text>
                </Pressable>
              )}
            </>
          )}
          {generateError && (
            <>
              <FormError message={suggestionsErrorMessage(generateError)} />
              {isValidationError(generateError) && (
                <Pressable onPress={() => router.push('/profile/edit')}>
                  <Text className="text-violet-400 text-sm font-semibold text-center">
                    Ajustar preferências
                  </Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      )}
    </View>
  )

  return (
    <View className="flex-1 bg-black">
      <FlatList
        // Ordem ranqueada pela IA — renderiza como veio, sem reordenar.
        data={suggestions}
        keyExtractor={item => item.placeId}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 12 }}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <SpotSuggestionCard suggestion={item} onChoose={() => choose(item)} />
        )}
      />
    </View>
  )
}
