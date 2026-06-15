import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { colors } from '@/shared/theme'

type IconName = ComponentProps<typeof Ionicons>['name']

type Benefit = {
  icon: IconName
  title: string
  description: string
}

const BENEFITS: Benefit[] = [
  {
    icon: 'rocket-outline',
    title: 'Eventos em destaque',
    description:
      'Seus eventos aparecem no topo da descoberta e do mapa — mais gente vê, mais gente vai.',
  },
  {
    icon: 'bar-chart-outline',
    title: 'Analytics completo',
    description:
      'Veja quem visualizou, curtiu e confirmou presença. Entenda seu público e acerte mais.',
  },
  {
    icon: 'trending-up-outline',
    title: 'Mais alcance',
    description:
      'Prioridade no feed e na busca para o seu perfil e tudo que você publica.',
  },
  {
    icon: 'sparkles-outline',
    title: 'Selo premium',
    description:
      'Um selo exclusivo no seu perfil que passa credibilidade à primeira vista.',
  },
]

export function PremiumBenefits() {
  return (
    <View className="gap-4">
      {BENEFITS.map(benefit => (
        <View key={benefit.title} className="flex-row items-start gap-3.5">
          <View className="w-10 h-10 rounded-full bg-brand/20 items-center justify-center">
            <Ionicons name={benefit.icon} size={20} color={colors.brandText} />
          </View>
          <View className="flex-1">
            <Text className="text-content font-semibold text-base">
              {benefit.title}
            </Text>
            <Text className="text-content-muted text-sm mt-0.5 leading-5">
              {benefit.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}
