import { isAxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}
