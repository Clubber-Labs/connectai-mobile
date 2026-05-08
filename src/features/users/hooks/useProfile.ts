import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersService, type UpdateMePayload } from '../services/usersService'
import { userKeys } from './cacheKeys'
import type { UserProfile } from '@/shared/types'

export function useMyProfile() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: usersService.getMe,
  })
}

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: userKeys.profile(id),
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  })
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateMePayload) => usersService.update(userId, data),
    onSuccess: (updated: UserProfile) => {
      queryClient.setQueryData(userKeys.me, updated)
      queryClient.setQueryData(userKeys.profile(updated.id), updated)
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.uploadAvatar,
    onSuccess: (updated: UserProfile) => {
      queryClient.setQueryData(userKeys.me, updated)
      queryClient.setQueryData(userKeys.profile(updated.id), updated)
    },
  })
}
