import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ConsentToggleRow } from '@/features/privacy/components/ConsentToggleRow'
import { useConsent } from '@/features/privacy/hooks/useConsent'
import {
  CATEGORY_LABELS,
  CONSENT_ITEMS,
  CONSENT_VERSION,
  type ConsentFields,
} from '@/features/privacy/services/consentService'
import { useConsentStore } from '@/features/privacy/store/consentStore'

const ORDERED_CATEGORIES = [
  'location',
  'social',
  'notifications',
  'marketing',
  'analytics',
  'research',
] as const

export default function PrivacyScreen() {
  const { updateConsent, revokeAll, exportData, isSynced, needsVersionBump } =
    useConsent()
  const [exporting, setExporting] = useState(false)

  // Lê os valores diretamente do store para o UI reativo
  const locationPrecise = useConsentStore(s => s.locationPrecise)
  const socialFeed = useConsentStore(s => s.socialFeed)
  const socialVisibility = useConsentStore(s => s.socialVisibility)
  const pushNotifications = useConsentStore(s => s.pushNotifications)
  const marketing = useConsentStore(s => s.marketing)
  const analytics = useConsentStore(s => s.analytics)
  const surveys = useConsentStore(s => s.surveys)
  const consentVersion = useConsentStore(s => s.consentVersion)

  const fieldValues: ConsentFields = {
    locationPrecise,
    socialFeed,
    socialVisibility,
    pushNotifications,
    marketing,
    analytics,
    surveys,
  }

  // Memoizado: estável em runtime
  const itemsByCategory = useMemo(
    () =>
      ORDERED_CATEGORIES.reduce<Record<string, typeof CONSENT_ITEMS>>(
        (acc, cat) => {
          acc[cat] = CONSENT_ITEMS.filter(i => i.category === cat)
          return acc
        },
        {},
      ),
    [],
  )

  async function handleToggle(key: keyof ConsentFields, value: boolean) {
    await updateConsent({ [key]: value })
  }

  function handleRevokeAll() {
    Alert.alert(
      'Revogar todos os consentimentos',
      'Isso desativa todas as funcionalidades opcionais. Você pode reativar a qualquer momento.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Revogar tudo', style: 'destructive', onPress: revokeAll },
      ],
    )
  }

  async function handleExport() {
    setExporting(true)
    try {
      const data = await exportData()
      await Share.share({
        title: 'Meus dados LGPD — ConnectAI',
        message: JSON.stringify(data, null, 2),
      })
    } catch {
      Alert.alert('Erro', 'Não foi possível exportar seus dados.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4 border-b border-zinc-800">
          <Text className="text-xl font-bold text-white">Privacidade</Text>
          <Text className="text-zinc-400 text-sm mt-1">
            Controle como o ConnectAI usa seus dados — LGPD nº 13.709/2018.
          </Text>

          {!isSynced && (
            <View className="flex-row items-center gap-2 mt-2">
              <ActivityIndicator size="small" color="#a78bfa" />
              <Text className="text-violet-400 text-xs">
                Salvando preferências…
              </Text>
            </View>
          )}

          {needsVersionBump && (
            <View className="mt-2 bg-amber-950 border border-amber-800 rounded-lg px-3 py-2">
              <Text className="text-amber-400 text-xs">
                ⚠️ Nossa Política de Privacidade foi atualizada para a v
                {CONSENT_VERSION}. Revise suas preferências abaixo.
              </Text>
            </View>
          )}
        </View>

        {/* Essencial — sempre ativo */}
        <View className="mx-4 mt-4 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-800">
            <View className="flex-row items-center gap-2">
              <Ionicons name="lock-closed" size={14} color="#a78bfa" />
              <Text className="text-sm font-semibold text-violet-400">
                Dados essenciais
              </Text>
            </View>
            <Text className="text-xs text-zinc-500">Sempre ativo</Text>
          </View>
          <View className="px-4 py-3">
            <Text className="text-xs text-zinc-400 leading-4">
              Necessários para autenticação, operação da conta e moderação de
              segurança. Não podem ser desativados.
            </Text>
          </View>
        </View>

        {/* Seções configuráveis */}
        {ORDERED_CATEGORIES.map(cat => {
          const items = itemsByCategory[cat]
          if (!items?.length) return null

          return (
            <View
              key={cat}
              className="mx-4 mt-3 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <View className="px-4 py-3 border-b border-zinc-800">
                <Text className="text-sm font-semibold text-zinc-300">
                  {CATEGORY_LABELS[cat]}
                </Text>
              </View>
              {items.map((item, idx) => (
                <ConsentToggleRow
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  value={fieldValues[item.key]}
                  onChange={v => handleToggle(item.key, v)}
                  isLast={idx === items.length - 1}
                />
              ))}
            </View>
          )
        })}

        {/* Direitos LGPD */}
        <View className="mx-4 mt-5 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <View className="px-4 py-3 border-b border-zinc-800">
            <Text className="text-sm font-semibold text-zinc-300">
              ⚖️ Direitos LGPD (Art. 18)
            </Text>
          </View>

          <Pressable
            onPress={() => Linking.openURL('https://connectai.app/privacidade')}
            className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-800 active:opacity-70"
          >
            <View className="flex-1">
              <Text className="text-sm font-medium text-white">
                Política de Privacidade
              </Text>
              <Text className="text-xs text-zinc-500 mt-0.5">
                Versão {consentVersion ?? CONSENT_VERSION} · Vigência:
                02/06/2026
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#71717a" />
          </Pressable>

          <Pressable
            onPress={handleExport}
            disabled={exporting}
            className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-800 active:opacity-70"
          >
            <View className="flex-1">
              <Text className="text-sm font-medium text-white">
                Exportar meus dados
              </Text>
              <Text className="text-xs text-zinc-500 mt-0.5">
                Receba seu histórico de consentimentos (Art. 18, V)
              </Text>
            </View>
            {exporting ? (
              <ActivityIndicator size="small" color="#a78bfa" />
            ) : (
              <Ionicons name="download-outline" size={16} color="#71717a" />
            )}
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL('mailto:privacidade@connectai.app')}
            className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-800 active:opacity-70"
          >
            <View className="flex-1">
              <Text className="text-sm font-medium text-white">
                Falar com a equipe de privacidade
              </Text>
              <Text className="text-xs text-zinc-500 mt-0.5">
                privacidade@connectai.app
              </Text>
            </View>
            <Ionicons name="mail-outline" size={16} color="#71717a" />
          </Pressable>

          <Pressable
            onPress={handleRevokeAll}
            className="px-4 py-4 active:opacity-70"
          >
            <Text className="text-sm font-medium text-red-400">
              Revogar todos os consentimentos
            </Text>
            <Text className="text-xs text-zinc-500 mt-0.5">
              Desativa todas as funcionalidades opcionais (Art. 8, §5)
            </Text>
          </Pressable>
        </View>

        <Text className="text-zinc-600 text-xs text-center mt-5 mx-8 leading-4">
          Alterações salvas automaticamente. Prazo de resposta: até 15 dias
          úteis.
        </Text>
      </ScrollView>
    </>
  )
}
