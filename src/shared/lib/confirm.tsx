import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ConfirmDialog,
  type ConfirmOptions,
} from '../components/ConfirmDialog'

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

type Pending = {
  options: ConfirmOptions
  resolve: (value: boolean) => void
} | null

const ConfirmContext = createContext<ConfirmFn | null>(null)

/**
 * Provider de confirmações custom do projeto. Substitui `Alert.alert` nativo
 * pra manter consistência visual com o tema dark e respeitar a regra do app
 * de não usar UI nativa de feedback. Use via `useConfirm()`.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending>(null)

  const confirm = useCallback<ConfirmFn>(options => {
    return new Promise(resolve => {
      setPending({ options, resolve })
    })
  }, [])

  function handleCancel() {
    pending?.resolve(false)
    setPending(null)
  }

  function handleConfirm() {
    pending?.resolve(true)
    setPending(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        visible={!!pending}
        options={pending?.options ?? { title: '' }}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </ConfirmContext.Provider>
  )
}

/**
 * Retorna uma função imperativa pra abrir o diálogo de confirmação.
 * Resolve `true` se o usuário confirmar, `false` se cancelar (ou fechar).
 *
 * @example
 *   const confirm = useConfirm()
 *   const ok = await confirm({
 *     title: 'Sair',
 *     message: 'Tem certeza?',
 *     confirmLabel: 'Sair',
 *     destructive: true,
 *   })
 *   if (ok) doLogout()
 */
export function useConfirm(): ConfirmFn {
  const fn = useContext(ConfirmContext)
  if (!fn) {
    throw new Error('useConfirm must be used within <ConfirmProvider>')
  }
  return fn
}
