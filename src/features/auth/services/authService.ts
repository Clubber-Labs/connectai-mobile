import { api } from '@/shared/lib/api'
import type { LoginInput } from '../schemas/loginSchema'

export const authService = {
  login: (data: LoginInput) =>
    api.post('/auth/login', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
}
