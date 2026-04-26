import '@/global.css'
import '@/shared/lib/reactotron'
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { queryClient } from '@/shared/lib/queryClient'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getToken, deleteToken } from '@/shared/lib/secureStore'
import { authService } from '@/features/auth/services/authService'

function AuthGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const hydrated = useAuthStore(s => s.hydrated)
  const setUser = useAuthStore(s => s.setUser)
  const logout = useAuthStore(s => s.logout)
  const setHydrated = useAuthStore(s => s.setHydrated)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    async function restoreSession() {
      const token = await getToken()
      if (token) {
        try {
          const me = await authService.me()
          setUser(me.id)
        } catch {
          await deleteToken()
          logout()
        }
      }
      setHydrated()
    }
    restoreSession()
  }, [setUser, logout, setHydrated])

  useEffect(() => {
    if (!hydrated) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/feed')
    }
  }, [hydrated, isAuthenticated, segments, router])

  return null
}

export default function RootLayout() {
  useFonts(Ionicons.font)

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <AuthGuard />
    </QueryClientProvider>
  )
}
