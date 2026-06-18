import { useMemo } from 'react'
import { View } from 'react-native'
import {
  WheelColumn,
  WHEEL_ITEM_HEIGHT,
  WHEEL_VISIBLE_ITEMS,
} from './WheelColumn'

const MONTHS_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

type Props = {
  value: Date
  onChange: (date: Date) => void
  minimumDate?: Date
  maximumDate?: Date
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

// Seletor de data dia/mês/ano em rodas (estilo Tinder), no nosso tema dark:
// banda de seleção da marca ao centro, colunas que desbotam nas bordas. Controla
// pelo `value` — cada coluna recompõe a data e clampa ao intervalo permitido.
export function WheelDatePicker({
  value,
  onChange,
  minimumDate,
  maximumDate,
}: Props) {
  const day = value.getDate()
  const month = value.getMonth()
  const year = value.getFullYear()

  const minYear = minimumDate?.getFullYear() ?? 1920
  const maxYear = maximumDate?.getFullYear() ?? new Date().getFullYear()

  const years = useMemo(() => {
    const list = []
    for (let y = maxYear; y >= minYear; y--)
      list.push({ label: String(y), value: y })
    return list
  }, [minYear, maxYear])

  const months = useMemo(
    () => MONTHS_PT.map((label, index) => ({ label, value: index })),
    [],
  )

  const days = useMemo(() => {
    const count = daysInMonth(year, month)
    return Array.from({ length: count }, (_, i) => ({
      label: String(i + 1),
      value: i + 1,
    }))
  }, [year, month])

  function commit(nextYear: number, nextMonth: number, nextDay: number) {
    const safeDay = Math.min(nextDay, daysInMonth(nextYear, nextMonth))
    onChange(
      clampDate(
        new Date(nextYear, nextMonth, safeDay),
        minimumDate,
        maximumDate,
      ),
    )
  }

  const containerHeight = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ITEMS

  return (
    <View style={{ height: containerHeight }} className="relative">
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (containerHeight - WHEEL_ITEM_HEIGHT) / 2,
          height: WHEEL_ITEM_HEIGHT,
        }}
        className="bg-brand-surface/30 border border-brand-surface-strong rounded-2xl"
      />
      <View className="flex-row">
        <WheelColumn
          items={days}
          selectedValue={day}
          onSelect={d => commit(year, month, d)}
        />
        <WheelColumn
          items={months}
          selectedValue={month}
          onSelect={m => commit(year, m, day)}
          flex={1.3}
        />
        <WheelColumn
          items={years}
          selectedValue={year}
          onSelect={y => commit(y, month, day)}
        />
      </View>
    </View>
  )
}
