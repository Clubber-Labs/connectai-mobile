import { api } from '@/shared/lib/api'
import type { LoginInput } from '../schemas/loginSchema'
import type { RegisterPayload } from '../schemas/registerSchema'
import type {
  SocialLoginPayload,
  SocialLoginResponse,
} from '../schemas/socialLoginSchema'

export const authService = {
  register: (data: RegisterPayload) =>
    api.post('/users', data).then(r => r.data),
  // skipAuthHandler: login é pré-sessão — um 401 aqui é "credenciais inválidas"
  // (tratado inline no LoginForm), nunca "sessão expirou". Sem isso, o 401 dispara
  // o handler global de sessão expirada (endSession) e mostra o banner indevido.
  login: (data: LoginInput) =>
    api.post('/auth/login', data, { skipAuthHandler: true }).then(r => r.data),
  me: () => api.get('/users/me').then(r => r.data),
  socialLogin: (data: SocialLoginPayload): Promise<SocialLoginResponse> =>
    api.post('/auth/social', data).then(r => r.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    api.post('/auth/reset-password', data).then(r => r.data),
}
