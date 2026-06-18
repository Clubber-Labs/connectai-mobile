import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { SheetModal } from './SheetModal'
import { WheelDatePicker } from './WheelDatePicker'
import { WheelDateTimePicker } from './WheelDateTimePicker'

type Mode = 'date' | 'datetime'

type Props = {
  value: Date | undefined
  onChange: (date: Date) => void
  placeholder?: string
  maximumDate?: Date
  minimumDate?: Date
  hasError?: boolean
  mode?: Mode
}

function formatValue(value: Date, mode: Mode): string {
  if (mode === 'datetime') {
    return `${value.toLocaleDateString('pt-BR')} ${value.toLocaleTimeString(
      'pt-BR',
      { hour: '2-digit', minute: '2-digit' },
    )}`
  }
  return value.toLocaleDateString('pt-BR')
}

// Campo de data/hora: mostra o valor e abre a roda própria (tema dark da marca)
// numa folha. Edita um rascunho — só comita no "Confirmar", então rolar as rodas
// não dispara updates parciais no form. Sem picker nativo (não aceita a marca).
export function DatePicker({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  maximumDate,
  minimumDate,
  hasError,
  mode = 'date',
}: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Date>(value ?? minimumDate ?? new Date())

  function handleOpen() {
    setDraft(value ?? minimumDate ?? new Date())
    setOpen(true)
  }

  function handleConfirm() {
    onChange(draft)
    setOpen(false)
  }

  return (
    <>
      <Pressable
        onPress={handleOpen}
        className={`border ${hasError ? 'border-content' : 'border-line'} bg-surface rounded-xl px-4 py-3.5`}
      >
        <Text
          className={
            value ? 'text-base text-content' : 'text-base text-content-subtle'
          }
        >
          {value ? formatValue(value, mode) : placeholder}
        </Text>
      </Pressable>

      <SheetModal visible={open} onClose={() => setOpen(false)}>
        <View className="px-5 pt-1">
          <View className="flex-row items-center justify-between pb-3">
            <Text className="text-content text-xl font-extrabold">
              {mode === 'datetime' ? 'Data e hora' : 'Data'}
            </Text>
            <Pressable onPress={handleConfirm} hitSlop={8}>
              <Text className="text-brand-text text-[15px] font-bold">
                Confirmar
              </Text>
            </Pressable>
          </View>

          {mode === 'datetime' ? (
            <WheelDateTimePicker
              value={draft}
              onChange={setDraft}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          ) : (
            <WheelDatePicker
              value={draft}
              onChange={setDraft}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </View>
      </SheetModal>
    </>
  )
}
