import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Bem-vindo de volta
      </Text>
      <Text className="text-gray-500 mb-8">
        Entre na sua conta para continuar
      </Text>

      <LoginForm />

      <View className="flex-row justify-center mt-6 gap-1">
        <Text className="text-gray-500">Não tem uma conta?</Text>
        <Link href="/(auth)/register">
          <Text className="text-blue-600 font-semibold">Cadastre-se</Text>
        </Link>
      </View>
    </View>
  )
}
