import { Redirect } from 'expo-router'
import { useAuthStore } from '@/features/auth/store/authStore'

export default function Index() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/feed" />
  }

  return <Redirect href="/(auth)/login" />
}
