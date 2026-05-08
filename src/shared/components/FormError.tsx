import { Text } from 'react-native'

type Props = {
  message: string | null | undefined
}

/**
 * Mensagem de erro inline pra forms — texto vermelho centralizado, renderizada
 * próximo ao botão de submit. Padrão do projeto pra feedback explícito de
 * submissão deliberada (login, edição de perfil, criação de evento).
 *
 * Não usar pra ações otimistas (likes, attendance, deletes) — essas usam
 * silent revert via TanStack Query optimistic update. Ver CLAUDE.md.
 */
export function FormError({ message }: Props) {
  if (!message) return null
  return (
    <Text className="text-red-500 text-sm text-center">{message}</Text>
  )
}
