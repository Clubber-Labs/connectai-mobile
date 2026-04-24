import { View, Text, TextInput, Switch } from 'react-native'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { RegisterInput } from '../../schemas/registerSchema'

type Props = {
  control: Control<RegisterInput>
  errors: FieldErrors<RegisterInput>
}

export function StepProfile({ control, errors }: Props) {
  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-gray-900">Seu perfil</Text>
        <Text className="text-sm text-gray-500">Opcional — você pode preencher depois.</Text>
      </View>

      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm font-medium text-gray-600">Bio</Text>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border ${errors.bio ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900`}
                placeholder="Conte algo sobre você..."
                placeholderTextColor="#9ca3af"
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
              />
            )}
          />
          {errors.bio && <Text className="text-red-500 text-xs">{errors.bio.message}</Text>}
        </View>

        <View className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
          <View className="gap-0.5">
            <Text className="text-base font-medium text-gray-900">Perfil privado</Text>
            <Text className="text-xs text-gray-500">Apenas seguidores aprovados verão seu conteúdo</Text>
          </View>
          <Controller
            control={control}
            name="isPrivate"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
                thumbColor="#fff"
              />
            )}
          />
        </View>
      </View>
    </View>
  )
}
