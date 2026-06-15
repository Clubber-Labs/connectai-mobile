/**
 * Formata um valor em centavos (como o Stripe envia) para moeda local.
 * Ex: formatPrice(1990, 'brl') → "R$ 19,90".
 *
 * Usa Intl quando disponível; cai num formato BRL manual se o runtime
 * (Hermes sem ICU completo) não suportar a currency, pra nunca lançar.
 */
export function formatPrice(amountInCents: number, currency = 'BRL'): string {
  const value = amountInCents / 100
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value)
  } catch {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }
}

const INTERVAL_LABEL: Record<string, string> = {
  month: 'mês',
  year: 'ano',
}

/** "month" → "mês", "year" → "ano". Fallback: devolve o próprio termo. */
export function formatInterval(interval: string): string {
  return INTERVAL_LABEL[interval] ?? interval
}
