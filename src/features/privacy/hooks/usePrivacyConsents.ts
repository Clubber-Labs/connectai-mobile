import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { privacyService } from '../services/privacyService'
import type { ConsentInput, PrivacyPurposeKey } from '../types'

export const privacyQueryKeys = {
  config: ['privacy', 'config'] as const,
  me: ['privacy', 'me'] as const,
}

export function usePrivacyConfig() {
  return useQuery({
    queryKey: privacyQueryKeys.config,
    queryFn: privacyService.getConfig,
    staleTime: 1000 * 60 * 30,
  })
}

export function useMyPrivacyConsents(enabled = true) {
  return useQuery({
    queryKey: privacyQueryKeys.me,
    queryFn: privacyService.getMyConsents,
    enabled,
    staleTime: 1000 * 60,
  })
}

export function useUpdatePrivacyConsents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (consents: ConsentInput[]) =>
      privacyService.updateMyConsents(consents),
    onSuccess: data => {
      queryClient.setQueryData(privacyQueryKeys.me, data)
      queryClient.invalidateQueries({ queryKey: privacyQueryKeys.me })
    },
  })
}

export function useRequestPrivacyExport() {
  return useMutation({
    mutationFn: privacyService.requestExport,
  })
}

export function useRequestPrivacyDelete() {
  return useMutation({
    mutationFn: privacyService.requestDelete,
  })
}

export function useHasPrivacyConsent(purposeKey: PrivacyPurposeKey) {
  const { data } = useMyPrivacyConsents()
  return data?.consents.some(c => c.key === purposeKey && c.granted) === true
}

export function usePrivacyConsentStatus(purposeKey: PrivacyPurposeKey) {
  const query = useMyPrivacyConsents()
  return {
    ...query,
    granted:
      query.data?.consents.some(c => c.key === purposeKey && c.granted) ===
      true,
  }
}
