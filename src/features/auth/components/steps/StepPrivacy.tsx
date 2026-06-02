import { ActivityIndicator, Switch, Text, View } from 'react-native'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import { usePrivacyConfig } from '@/features/privacy/hooks/usePrivacyConsents'
import { PRIVACY_PURPOSES_FALLBACK } from '@/features/privacy/types'
import type { RegisterInput } from '../../schemas/registerSchema'

type Props = {
  control: Control<RegisterInput>
  errors: FieldErrors<RegisterInput>
}

export function StepPrivacy({ control, errors }: Props) {
  const { data, isLoading } = usePrivacyConfig()
  const purposes = data?.purposes ?? PRIVACY_PURPOSES_FALLBACK
  const requiredError =
    errors.consents?.terms_privacy_required?.message?.toString()

  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-white">Privacidade e LGPD</Text>
        <Text className="text-sm text-zinc-400">
          Escolha quais usos de dados você autoriza no ConnectAI.
        </Text>
      </View>

      {isLoading && !data && (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color="#8b5cf6" />
          <Text className="text-xs text-zinc-500">
            Carregando configuração de consentimento...
          </Text>
        </View>
      )}

      <View className="gap-3">
        {purposes.map(purpose => (
          <View
            key={purpose.key}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5"
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-semibold text-white flex-1">
                    {purpose.label}
                  </Text>
                  {purpose.required && (
                    <Text className="text-[10px] font-bold uppercase text-violet-300">
                      Obrigatório
                    </Text>
                  )}
                </View>
                <Text className="text-xs text-zinc-400">
                  {purpose.description}
                </Text>
              </View>
              <Controller
                control={control}
                name={`consents.${purpose.key}`}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#27272a', true: '#8b5cf6' }}
                    thumbColor="#fff"
                  />
                )}
              />
            </View>
          </View>
        ))}
      </View>

      {requiredError && (
        <Text className="text-white text-xs">{requiredError}</Text>
      )}
    </View>
  )
}
