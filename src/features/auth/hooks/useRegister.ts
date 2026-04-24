import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { api } from '@/shared/lib/api'
import { useAuthStore } from '../store/authStore'
import { saveToken } from '@/shared/lib/secureStore'
import type { RegisterInput, RegisterPayload } from '../schemas/registerSchema'

export function useRegister() {
  const setUser = useAuthStore(s => s.setUser)
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const payload: RegisterPayload = {
        name: data.name,
        lastname: data.lastname,
        username: data.username,
        phone: data.phone,
        email: data.email,
        password: data.password,
        birthdate: data.birthdate.toISOString(),
        bio: data.bio,
        isPrivate: data.isPrivate,
      }

      await api.post('/users', payload)

      const { data: loginData } = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      })

      const { data: me } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${loginData.token}` },
      })

      return { token: loginData.token as string, userId: me.id as string }
    },
    onSuccess: async ({ token, userId }) => {
      await saveToken(token)
      setUser(userId)
      router.replace('/(tabs)/feed')
    },
  })
}
