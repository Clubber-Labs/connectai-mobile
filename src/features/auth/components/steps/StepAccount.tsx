import { View, Text, TextInput } from 'react-native'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { RegisterInput } from '../../schemas/registerSchema'

type Props = {
  control: Control<RegisterInput>
  errors: FieldErrors<RegisterInput>
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) =>
      c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : '',
    )
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) =>
    c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : '',
  )
}

export function StepAccount({ control, errors }: Props) {
  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-gray-900">Sua conta</Text>
        <Text className="text-sm text-gray-500">Esses dados são usados para acessar o ConnectAI.</Text>
      </View>

      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm font-medium text-gray-600">Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border ${errors.username ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900`}
                placeholder="joaosilva"
                placeholderTextColor="#9ca3af"
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          {errors.username && <Text className="text-red-500 text-xs">{errors.username.message}</Text>}
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-gray-600">E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border ${errors.email ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900`}
                placeholder="joao@email.com"
                placeholderTextColor="#9ca3af"
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && <Text className="text-red-500 text-xs">{errors.email.message}</Text>}
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-gray-600">Telefone</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border ${errors.phone ? 'border-red-400' : 'border-gray-200'} bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900`}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#9ca3af"
                onChangeText={text => onChange(text.replace(/\D/g, ''))}
                value={formatPhone(value ?? '')}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && <Text className="text-red-500 text-xs">{errors.phone.message}</Text>}
        </View>
      </View>
    </View>
  )
}
