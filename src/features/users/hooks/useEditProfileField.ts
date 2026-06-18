import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useMyProfile, useUpdateProfile } from './useProfile'
import { isConflictError } from '@/shared/lib/apiError'
import type { UpdateMePayload } from '../services/usersService'

// Orquestra o salvar de uma tela focada de um campo só: pega o perfil (cache
// quente vindo do hub), aplica o PATCH parcial e volta. Erro de username em uso
// (409) vira sinal inline na própria tela; demais erros, mensagem genérica.
export function useEditProfileField() {
  const router = useRouter()
  const { data: profile } = useMyProfile()
  const update = useUpdateProfile(profile?.id ?? '')
  const [error, setError] = useState<string | null>(null)

  function save(patch: UpdateMePayload) {
    setError(null)
    update.mutate(patch, {
      onSuccess: () => router.back(),
      onError: err =>
        setError(
          isConflictError(err)
            ? 'Esse nome de usuário já está em uso.'
            : 'Não foi possível salvar. Tente novamente.',
        ),
    })
  }

  return { profile, save, saving: update.isPending, error }
}
