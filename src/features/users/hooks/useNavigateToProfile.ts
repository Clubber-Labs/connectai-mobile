import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/features/auth/store/authStore'

/**
 * Navega pro perfil de um usuário. Se o id for do próprio viewer, redireciona
 * pra aba "Meu Perfil" em vez da tela genérica `/users/:id` — perfil próprio
 * tem campos privados (email, phone, birthdate) que não vêm em GET /users/:id.
 *
 * Use em qualquer lugar que mostre nome/avatar de outro usuário (cards do feed,
 * autor de post/comentário, lista de seguidores etc).
 */
export function useNavigateToProfile() {
  const router = useRouter()
  const viewerId = useAuthStore(s => s.userId)

  return useCallback(
    (userId: string) => {
      if (!userId) return
      if (userId === viewerId) {
        router.push('/(tabs)/profile')
      } else {
        router.push(`/users/${userId}`)
      }
    },
    [router, viewerId],
  )
}
