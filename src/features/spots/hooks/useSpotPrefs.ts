import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { UserProfile } from '@/shared/types'
import { useMyProfile } from '@/features/users/hooks/useProfile'
import { userKeys } from '@/features/users/hooks/cacheKeys'
import { spotsService } from '../services/spotsService'

// Bounds do raio de spots, espelhando o servidor (mesmo modelo do raio de
// notificações). O teto real é do backend (400 "Raio máximo permitido: Nkm");
// MAX aqui é só o limite do slider. DEFAULT é fallback antes de /users/me
// carregar — a fonte da verdade é o spotRadiusKm do perfil.
export const SPOT_RADIUS_MIN_KM = 2
export const SPOT_RADIUS_MAX_KM = 50
export const SPOT_RADIUS_DEFAULT_KM = 15

function clampRadiusKm(km: number): number {
  return Math.min(
    SPOT_RADIUS_MAX_KM,
    Math.max(SPOT_RADIUS_MIN_KM, Math.round(km)),
  )
}

function setProfileRadius(queryClient: QueryClient, km: number) {
  queryClient.setQueryData<UserProfile>(userKeys.me, prev =>
    prev ? { ...prev, spotRadiusKm: km } : prev,
  )
}

// Diferente do raio de notificações, GET /users/me JÁ expõe spotRadiusKm — então
// o perfil é a fonte da verdade e não precisa de store persistido. Otimista com
// revert (padrão do projeto); aqui o erro é RE-LANÇADO pra tela de config exibir
// o 400 de teto (o caller decide a mensagem).
export function useSpotPrefs() {
  const queryClient = useQueryClient()
  const { data: profile } = useMyProfile()
  const spotRadiusKm = profile?.spotRadiusKm ?? SPOT_RADIUS_DEFAULT_KM

  const saveRadius = useCallback(
    async (km: number) => {
      const next = clampRadiusKm(km)
      if (next === spotRadiusKm) return
      const previousProfile = queryClient.getQueryData<UserProfile>(userKeys.me)

      setProfileRadius(queryClient, next)
      try {
        const result = await spotsService.updateSpotPrefs(next)
        setProfileRadius(queryClient, result.spotRadiusKm)
      } catch (err) {
        if (previousProfile) {
          queryClient.setQueryData(userKeys.me, previousProfile)
        }
        throw err
      }
    },
    [spotRadiusKm, queryClient],
  )

  return { spotRadiusKm, saveRadius }
}
