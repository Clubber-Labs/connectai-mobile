import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { authService } from '../services/authService'
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

      await authService.register(payload)
      const { token } = await authService.login({ email: data.email, password: data.password })
      const me = await authService.me()
      return { token: token as string, userId: me.id as string }
    },
    onSuccess: async ({ token, userId }) => {
      await saveToken(token)
      setUser(userId)
      router.replace('/(tabs)/feed')
    },
  })
}
