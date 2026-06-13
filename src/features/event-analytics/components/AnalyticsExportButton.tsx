import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useExportEventAnalytics } from '../hooks/useExportEventAnalytics'
import { colors } from '@/shared/theme'

type Props = {
  eventId: string
}

// Ação de submit deliberada: loading e erro inline vêm do hook (tela → hook →
// service). O botão fica desabilitado durante o export, evitando duplo disparo.
export function AnalyticsExportButton({ eventId }: Props) {
  const { exportCsv, exporting, error } = useExportEventAnalytics(eventId)

  return (
    <View className="gap-1">
      <Pressable
        onPress={exportCsv}
        disabled={exporting}
        accessibilityRole="button"
        className={`flex-row items-center justify-center gap-2 rounded-lg py-3 px-6 border border-line-strong ${exporting ? 'opacity-60' : ''}`}
      >
        {exporting ? (
          <ActivityIndicator size="small" color={colors.lineStrong} />
        ) : (
          <Ionicons
            name="download-outline"
            size={18}
            color={colors.contentSecondary}
          />
        )}
        <Text className="text-content-secondary font-semibold text-base">
          Exportar CSV
        </Text>
      </Pressable>
      {error && (
        <Text className="text-danger text-sm text-center">{error}</Text>
      )}
    </View>
  )
}
