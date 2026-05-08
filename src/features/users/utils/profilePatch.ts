import type { UserProfile } from '@/shared/types'
import type { UpdateMePayload } from '../services/usersService'
import type { EditProfileInput } from '../schemas/editProfileSchema'

/**
 * Compara o estado atual do perfil com os valores do formulário e retorna
 * apenas os campos alterados — partial update conforme contrato do backend.
 * Função pura: sem efeitos, sem dependências de UI.
 */
export function buildProfilePatch(
  profile: UserProfile,
  form: EditProfileInput,
): UpdateMePayload {
  const patch: UpdateMePayload = {}

  if (form.name !== profile.name) patch.name = form.name
  if (form.lastname !== profile.lastname) patch.lastname = form.lastname
  if (form.username !== profile.username) patch.username = form.username
  if (form.phone !== (profile.phone ?? '')) patch.phone = form.phone
  if (form.bio !== (profile.bio ?? '')) patch.bio = form.bio
  if (form.isPrivate !== profile.isPrivate) patch.isPrivate = form.isPrivate

  const formDate = toIsoDate(form.birthdate)
  const profileDate = profile.birthdate ? profile.birthdate.split('T')[0] : ''
  if (formDate !== profileDate) patch.birthdate = formDate

  return patch
}

export function isPatchEmpty(patch: UpdateMePayload): boolean {
  return Object.keys(patch).length === 0
}

function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
