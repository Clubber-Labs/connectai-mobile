import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export default function RegisterScreen() {
  return (
    <View className="flex-1 bg-white px-6 pt-16 pb-8">
      <RegisterForm />

      <View className="flex-row justify-center mt-6 gap-1">
        <Text className="text-gray-500">Já tem uma conta?</Text>
        <Link href="/(auth)/login">
          <Text className="text-blue-600 font-semibold">Entrar</Text>
        </Link>
      </View>
    </View>
  )
}
