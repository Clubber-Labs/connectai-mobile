// Pure function (loadSession) + orquestração (useRestoreSession) —
// ver CLAUDE.md → "Separação de responsabilidades".
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import {
  getToken,
  getUserId,
  saveUserId,
  getProfileIncomplete,
  saveProfileIncomplete,
} from '@/shared/lib/secureStore'
import type { UserProfile } from '@/shared/types'

type SessionResult =
  | {
      kind: 'authenticated'
      userId: string
      profile: UserProfile | null
      persistedIncomplete: boolean | null
    }
  | { kind: 'unauthenticated' }

// 401 é tratado globalmente pelo interceptor em shared/lib/api.ts.
async function loadSession(): Promise<SessionResult> {
  const token = await getToken()
  if (!token) return { kind: 'unauthenticated' }

  const storedUserId = await getUserId()
  const persistedIncomplete = await getProfileIncomplete()

  if (storedUserId) {
    // Tentar buscar o profile pra detectar profileIncomplete; se falhar
    // (offline, 500), seguimos autenticado com o valor persistido (se houver).
    try {
      const profile = await authService.me()
      return {
        kind: 'authenticated',
        userId: storedUserId,
        profile,
        persistedIncomplete,
      }
    } catch {
      return {
        kind: 'authenticated',
        userId: storedUserId,
        profile: null,
        persistedIncomplete,
      }
    }
  }

  try {
    const profile = await authService.me()
    await saveUserId(profile.id)
    return {
      kind: 'authenticated',
      userId: profile.id,
      profile,
      persistedIncomplete,
    }
  } catch {
    return { kind: 'unauthenticated' }
  }
}

function isProfileIncomplete(profile: UserProfile): boolean {
  return !profile.phone || !profile.birthdate
}

export function useRestoreSession() {
  const setUser = useAuthStore(s => s.setUser)
  const setProfileIncomplete = useAuthStore(s => s.setProfileIncomplete)
  const setHydrated = useAuthStore(s => s.setHydrated)

  useEffect(() => {
    async function run() {
      const session = await loadSession()
      if (session.kind === 'authenticated') {
        if (session.profile) {
          // me() retornou — fonte de verdade. Atualiza memória + persiste.
          const incomplete = isProfileIncomplete(session.profile)
          setProfileIncomplete(incomplete)
          await saveProfileIncomplete(incomplete)
        } else if (session.persistedIncomplete !== null) {
          // me() falhou, mas temos o último valor persistido — usa ele pra
          // não bypassar a tela de completar perfil quando offline.
          setProfileIncomplete(session.persistedIncomplete)
          // Retry em background: quando reconectar, valor real prevalece.
          authService
            .me()
            .then(profile => {
              const incomplete = isProfileIncomplete(profile)
              setProfileIncomplete(incomplete)
              return saveProfileIncomplete(incomplete)
            })
            .catch(() => {})
        }
        // Sem persisted e sem profile: cai no default false do store. Cenário
        // raro (user pré-update sem flag persistida + offline). Aceitável.
        setUser(session.userId)
      }
      setHydrated()
    }
    run()
  }, [setUser, setProfileIncomplete, setHydrated])
}
