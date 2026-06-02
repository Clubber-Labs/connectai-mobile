export const PRIVACY_POLICY_VERSION = '2026-06-02'
export const PRIVACY_TERMS_VERSION = '2026-06-02'

export const PRIVACY_PURPOSE_KEYS = [
  'terms_privacy_required',
  'location_precise_nearby',
  'location_manual_or_approx',
  'feed_social_personalization',
  'social_activity_visibility',
  'push_event_updates',
  'marketing_premium',
  'analytics_product',
  'research_feedback',
] as const

export type PrivacyPurposeKey = (typeof PRIVACY_PURPOSE_KEYS)[number]

export type ConsentInput = {
  purposeKey: PrivacyPurposeKey
  granted: boolean
}

export type ConsentFormState = Record<PrivacyPurposeKey, boolean>

export type PrivacyPurpose = {
  key: PrivacyPurposeKey
  label: string
  description: string
  required: boolean
  defaultGranted: boolean
  legalBasis: string
}

export type PrivacyConsentState = PrivacyPurpose & {
  granted: boolean
  policyVersion: string | null
  termsVersion: string | null
  updatedAt: string | null
  revokedAt: string | null
}

export type PrivacyConfigResponse = {
  policyVersion: string
  termsVersion: string
  purposes: PrivacyPurpose[]
}

export type MyPrivacyConsentsResponse = {
  policyVersion: string
  termsVersion: string
  consents: PrivacyConsentState[]
}

export type PrivacyRequestResponse = {
  id: string
  type: 'EXPORT' | 'DELETE_ANONYMIZE'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  requestedAt: string
}

export const PRIVACY_PURPOSES_FALLBACK: PrivacyPurpose[] = [
  {
    key: 'terms_privacy_required',
    label: 'Termos de Uso e Política de Privacidade',
    description:
      'Obrigatório para criar e manter sua conta no ConnectAI.',
    required: true,
    defaultGranted: false,
    legalBasis: 'execucao_de_contrato',
  },
  {
    key: 'location_precise_nearby',
    label: 'Localização precisa para eventos próximos',
    description:
      'Permite usar sua posição atual para ordenar e sugerir eventos perto de você.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
  {
    key: 'location_manual_or_approx',
    label: 'Localização aproximada ou manual',
    description:
      'Permite usar cidade, bairro ou região informada para descoberta de eventos.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
  {
    key: 'feed_social_personalization',
    label: 'Personalização social do feed',
    description:
      'Usa categorias, follows e interações para melhorar as recomendações.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
  {
    key: 'social_activity_visibility',
    label: 'Visibilidade das minhas interações sociais',
    description:
      'Permite que curtidas, follows e presenças autorizadas apareçam em áreas sociais.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
  {
    key: 'push_event_updates',
    label: 'Notificações de eventos e convites',
    description:
      'Permite receber avisos de eventos, convites e atualizações relevantes.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
  {
    key: 'marketing_premium',
    label: 'Novidades, pesquisas e ofertas premium',
    description:
      'Permite receber comunicações promocionais e novidades do ConnectAI.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
  {
    key: 'analytics_product',
    label: 'Métricas de uso para melhoria do app',
    description:
      'Ajuda a medir estabilidade, desempenho e uso agregado das funcionalidades.',
    required: false,
    defaultGranted: false,
    legalBasis: 'legitimo_interesse',
  },
  {
    key: 'research_feedback',
    label: 'Pesquisas do projeto ConnectAI',
    description:
      'Permite usar respostas voluntárias para pesquisa acadêmica e evolução do TCC.',
    required: false,
    defaultGranted: false,
    legalBasis: 'consentimento',
  },
]

export const DEFAULT_CONSENT_FORM_STATE: ConsentFormState =
  PRIVACY_PURPOSE_KEYS.reduce((acc, key) => {
    acc[key] = false
    return acc
  }, {} as ConsentFormState)

export function toConsentInputList(consents: ConsentFormState): ConsentInput[] {
  return PRIVACY_PURPOSE_KEYS.map(purposeKey => ({
    purposeKey,
    granted: consents[purposeKey],
  }))
}
