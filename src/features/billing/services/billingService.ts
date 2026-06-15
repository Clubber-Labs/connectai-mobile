import { api } from '@/shared/lib/api'
import { isNotFoundError } from '@/shared/lib/apiError'
import type { Plan, SubscribeIntent, Subscription } from '../types'

export const billingService = {
  // Preço do Premium lido do Stripe (fonte da verdade) + elegibilidade de
  // trial deste usuário. Alimenta a tela de upgrade.
  getPlan: (): Promise<Plan> => api.get('/billing/plan').then(r => r.data),

  // Cria a assinatura no backend e devolve os secrets que a PaymentSheet
  // precisa pra confirmar o pagamento (ou coletar o cartão, no trial).
  subscribe: (): Promise<SubscribeIntent> =>
    api.post('/billing/subscribe').then(r => r.data),

  // 404 = "nunca assinou / nada ativo" — estado normal, não erro. Normaliza
  // pra null pro useQuery não entrar em retry/error à toa.
  getSubscription: (): Promise<Subscription | null> =>
    api
      .get('/billing/subscription')
      .then(r => r.data as Subscription)
      .catch(err => {
        if (isNotFoundError(err)) return null
        throw err
      }),

  cancel: (): Promise<void> =>
    api.post('/billing/cancel').then(() => undefined),

  resume: (): Promise<void> =>
    api.post('/billing/resume').then(() => undefined),
}
