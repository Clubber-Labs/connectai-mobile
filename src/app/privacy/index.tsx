import { useMemo } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useMyPrivacyConsents,
  useRequestPrivacyDelete,
  useRequestPrivacyExport,
  useUpdatePrivacyConsents,
} from '@/features/privacy/hooks/usePrivacyConsents'
import { Button } from '@/shared/components/Button'
import { useBanner } from '@/shared/lib/banner'
import { getApiError } from '@/shared/lib/apiError'
import type { PrivacyConsentState } from '@/features/privacy/types'

function orderConsents(consents: PrivacyConsentState[]) {
  return [...consents].sort((a, b) => {
    if (a.required && !b.required) return -1
    if (!a.required && b.required) return 1
    return a.label.localeCompare(b.label)
  })
}

export default function PrivacyScreen() {
  const router = useRouter()
  const showBanner = useBanner()
  const { data, isLoading, isError, refetch } = useMyPrivacyConsents()
  const updateConsents = useUpdatePrivacyConsents()
  const exportRequest = useRequestPrivacyExport()
  const deleteRequest = useRequestPrivacyDelete()

  const consents = useMemo(
    () => orderConsents(data?.consents ?? []),
    [data?.consents],
  )

  async function handleToggle(consent: PrivacyConsentState, granted: boolean) {
    try {
      await updateConsents.mutateAsync([
        { purposeKey: consent.key, granted },
      ])
      showBanner('Preferência de privacidade atualizada.')
    } catch (error) {
      showBanner(getApiError(error).message)
    }
  }

  async function handleExportRequest() {
    try {
      await exportRequest.mutateAsync()
      showBanner('Solicitação de acesso aos dados registrada.')
    } catch (error) {
      showBanner(getApiError(error).message)
    }
  }

  async function handleDeleteRequest() {
    try {
      await deleteRequest.mutateAsync()
      showBanner('Solicitação de exclusão/anonimização registrada.')
    } catch (error) {
      showBanner(getApiError(error).message)
    }
  }

  return (
    <View className="flex-1 bg-black">
      <View className="pt-14 pb-4 px-5 border-b border-zinc-900">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">
              Privacidade e LGPD
            </Text>
            <Text className="text-zinc-400 text-xs mt-0.5">
              Consentimento granular e direitos do titular
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-zinc-400 text-center">
            Não foi possível carregar suas preferências.
          </Text>
          <Button label="Tentar novamente" onPress={() => refetch()} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
        >
          <View className="gap-4">
            <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 gap-1">
              <Text className="text-white font-semibold">
                Versão vigente
              </Text>
              <Text className="text-zinc-400 text-xs">
                Política {data?.policyVersion} · Termos {data?.termsVersion}
              </Text>
            </View>

            {consents.map(consent => {
              const disabled = consent.required || updateConsents.isPending
              return (
                <View
                  key={consent.key}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-white font-semibold text-base flex-1">
                          {consent.label}
                        </Text>
                        {consent.required && (
                          <Text className="text-[10px] text-violet-300 font-bold uppercase">
                            Obrigatório
                          </Text>
                        )}
                      </View>
                      <Text className="text-zinc-400 text-xs">
                        {consent.description}
                      </Text>
                      <Text className="text-zinc-500 text-[11px] mt-1">
                        Base legal: {consent.legalBasis}
                      </Text>
                    </View>
                    <Switch
                      value={consent.granted}
                      disabled={disabled}
                      onValueChange={granted => handleToggle(consent, granted)}
                      trackColor={{ false: '#27272a', true: '#8b5cf6' }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              )
            })}

            <View className="gap-3 pt-2">
              <Button
                label={
                  exportRequest.isPending
                    ? 'Registrando...'
                    : 'Solicitar meus dados'
                }
                onPress={handleExportRequest}
                loading={exportRequest.isPending}
                variant="secondary"
              />
              <Button
                label={
                  deleteRequest.isPending
                    ? 'Registrando...'
                    : 'Solicitar exclusão/anonimização'
                }
                onPress={handleDeleteRequest}
                loading={deleteRequest.isPending}
                variant="secondary"
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}
