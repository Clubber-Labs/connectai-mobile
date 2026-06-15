import { useQuery } from '@tanstack/react-query'
import { billingService } from '../services/billingService'
import { billingKeys } from './cacheKeys'

// O preço muda raríssimas vezes — staleTime longo evita refetch a cada
// abertura da tela. A tela degrada graciosamente se isto falhar/carregar.
export function usePlan() {
  return useQuery({
    queryKey: billingKeys.plan,
    queryFn: billingService.getPlan,
    staleTime: 1000 * 60 * 60,
  })
}
