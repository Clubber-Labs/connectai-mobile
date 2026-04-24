import '@/global.css'
import '@/shared/lib/reactotron'
import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getToken, deleteToken } from '@/shared/lib/secureStore'
import { authService } from '@/features/auth/services/authService'

function AuthGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const setUser = useAuthStore(s => s.setUser)
  const logout = useAuthStore(s => s.logout)
  const segments = useSegments()
  const router = useRouter()
  const [ready, setReady] = useState(false)

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
      setReady(true)
    }
    restoreSession()
  }, [setUser, logout])

  useEffect(() => {
    if (!ready) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/feed')
    }
  }, [ready, isAuthenticated, segments, router])

  return null
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <AuthGuard />
    </QueryClientProvider>
  )
}
