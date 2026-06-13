import { useState } from 'react'
import { View, Text, Pressable, ActivityIndicator, Share } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { eventAnalyticsService } from '../services/eventAnalyticsService'
import { colors } from '@/shared/theme'

type Props = {
  eventId: string
}

// Busca o CSV do backend e abre o share sheet nativo (mesmo padrão do export de
// dados LGPD). Como é uma ação deliberada de submit, erro vira texto inline.
export function AnalyticsExportButton({ eventId }: Props) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    if (exporting) return
    setExporting(true)
    setError(null)
    try {
      const csv = await eventAnalyticsService.exportCsv(eventId)
      await Share.share({
        title: 'Analytics do evento — ConnectAI',
        message: csv,
      })
    } catch {
      setError('Não foi possível exportar agora. Tente novamente.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <View className="gap-1">
      <Pressable
        onPress={handleExport}
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
