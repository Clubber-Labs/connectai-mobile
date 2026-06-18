import { useMemo } from 'react'
import { View, Text } from 'react-native'
import {
  WheelColumn,
  WHEEL_ITEM_HEIGHT,
  WHEEL_VISIBLE_ITEMS,
} from './WheelColumn'
import { formatWheelDay } from '@/shared/utils/dateFormat'

type Props = {
  value: Date
  onChange: (date: Date) => void
  minimumDate?: Date
  maximumDate?: Date
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function diffDays(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000,
  )
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days)
}

function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

const pad = (n: number) => String(n).padStart(2, '0')

const COLUMN_LABEL =
  'text-center text-content-subtle text-[11px] font-bold uppercase tracking-wider'

// Seletor de data+hora em rodas (padrão iOS), no tema dark da marca. Coluna de
// data com rótulo relativo ("Hoje" / "qua, 12 de mar") + Hora + Minuto — bem
// mais usável que cinco colunas numéricas. Controla pelo `value` e clampa ao
// intervalo permitido.
export function WheelDateTimePicker({
  value,
  onChange,
  minimumDate,
  maximumDate,
}: Props) {
  const base = useMemo(
    () => startOfDay(minimumDate ?? new Date()),
    [minimumDate],
  )

  const valueOffset = diffDays(value, base)
  const maxOffset = useMemo(() => {
    const fromMax = maximumDate ? diffDays(maximumDate, base) : 365
    return Math.max(fromMax, valueOffset, 0)
  }, [maximumDate, base, valueOffset])

  const dateItems = useMemo(
    () =>
      Array.from({ length: maxOffset + 1 }, (_, i) => ({
        label: formatWheelDay(addDays(base, i)),
        value: i,
      })),
    [maxOffset, base],
  )
  const hourItems = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({ label: pad(i), value: i })),
    [],
  )
  const minuteItems = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({ label: pad(i), value: i })),
    [],
  )

  const offset = Math.max(0, Math.min(maxOffset, valueOffset))
  const hour = value.getHours()
  const minute = value.getMinutes()

  function commit(nextOffset: number, nextHour: number, nextMinute: number) {
    const next = addDays(base, nextOffset)
    next.setHours(nextHour, nextMinute, 0, 0)
    onChange(clampDate(next, minimumDate, maximumDate))
  }

  const containerHeight = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ITEMS

  return (
    <View>
      <View className="flex-row mb-1">
        <Text style={{ flex: 1 }} className={COLUMN_LABEL}>
          Data
        </Text>
        <Text style={{ flex: 1 }} className={COLUMN_LABEL}>
          Hora
        </Text>
        <Text style={{ flex: 1 }} className={COLUMN_LABEL}>
          Min
        </Text>
      </View>

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
            items={dateItems}
            selectedValue={offset}
            onSelect={o => commit(o, hour, minute)}
            flex={3.2}
          />
          <WheelColumn
            items={hourItems}
            selectedValue={hour}
            onSelect={h => commit(offset, h, minute)}
          />
          <WheelColumn
            items={minuteItems}
            selectedValue={minute}
            onSelect={m => commit(offset, hour, m)}
          />
        </View>
      </View>
    </View>
  )
}
