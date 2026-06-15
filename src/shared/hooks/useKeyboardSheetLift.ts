import { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform, type View } from 'react-native'

// Levanta uma folha (bottom sheet) ancorada embaixo até encostar no topo do
// teclado, no iOS. No Android o windowSoftInputMode=adjustResize já encolhe a
// janela, então um elemento em bottom-0 sobe sozinho — aqui é no-op.
//
// Mede a posição REAL da folha na janela e levanta só pela sobreposição com o
// teclado. Assim independe do que houver ABAIXO do conteúdo (tab bar de 96px,
// safe area) — calcular por keyboardHeight cru levantaria demais e deixaria um
// vão. Espalhe `ref` na View raiz da folha e aplique translateY de -lift.
export function useKeyboardSheetLift() {
  const ref = useRef<View>(null)
  const [lift, setLift] = useState(0)
  // Recupera a posição de repouso ao re-medir: a folha já pode estar transladada
  // quando o teclado troca de altura sem fechar antes (ex.: barra de sugestões).
  const liftRef = useRef(0)

  useEffect(() => {
    if (Platform.OS !== 'ios') return

    function apply(value: number) {
      liftRef.current = value
      setLift(value)
    }

    const show = Keyboard.addListener('keyboardWillShow', e => {
      const keyboardTop = e.endCoordinates.screenY
      ref.current?.measureInWindow((_x, y, _width, height) => {
        const restingBottom = y + height + liftRef.current
        apply(Math.max(0, restingBottom - keyboardTop))
      })
    })
    const hide = Keyboard.addListener('keyboardWillHide', () => apply(0))

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return { ref, lift }
}
