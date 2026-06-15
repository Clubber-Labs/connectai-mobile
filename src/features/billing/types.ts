export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'INCOMPLETE'
  | 'INCOMPLETE_EXPIRED'
  | 'UNPAID'

export type Subscription = {
  id: string
  status: SubscriptionStatus
  trialEndsAt: string | null
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
  startedAt: string
}

// Resposta do GET /billing/plan — preço do Premium lido do Stripe + se este
// usuário ainda tem direito ao trial. `amount` em centavos; `currency` ISO.
export type Plan = {
  amount: number
  currency: string
  interval: 'month' | 'year'
  intervalCount: number
  trialDays: number
  trialEligible: boolean
}

// Resposta do POST /billing/subscribe (fluxo PaymentSheet).
// intentType decide qual confirmação a sheet faz: 'payment' cobra a 1ª
// invoice agora; 'setup' só coleta o cartão (assinatura em trial).
export type SubscribeIntent = {
  subscriptionId: string
  clientSecret: string
  intentType: 'payment' | 'setup'
  customerId: string
  ephemeralKey: string
}
