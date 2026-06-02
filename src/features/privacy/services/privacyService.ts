import { api } from '@/shared/lib/api'
import type {
  ConsentInput,
  MyPrivacyConsentsResponse,
  PrivacyConfigResponse,
  PrivacyRequestResponse,
} from '../types'

export const privacyService = {
  getConfig: (): Promise<PrivacyConfigResponse> =>
    api.get('/privacy/consents/config').then(r => r.data),

  getMyConsents: (): Promise<MyPrivacyConsentsResponse> =>
    api.get('/privacy/consents/me').then(r => r.data),

  updateMyConsents: (
    consents: ConsentInput[],
  ): Promise<MyPrivacyConsentsResponse> =>
    api.put('/privacy/consents/me', { consents }).then(r => r.data),

  requestExport: (): Promise<PrivacyRequestResponse> =>
    api.post('/privacy/requests/export').then(r => r.data),

  requestDelete: (): Promise<PrivacyRequestResponse> =>
    api.post('/privacy/requests/delete').then(r => r.data),
}
