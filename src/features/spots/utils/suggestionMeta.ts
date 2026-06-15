// Formatadores puros dos sinais de um lugar sugerido. A distância reaproveita
// formatDistance (shared/utils/distance) convertendo metros → km no card.

// Nota de avaliação (0..5) com vírgula decimal pt-BR: 4.5 → "4,5".
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',')
}

// Enum de faixa de preço (Google Places) → cifrões. Níveis sem preço útil
// (grátis/indefinido/desconhecido) viram null e somem do card.
const PRICE_LEVEL_SYMBOLS: Record<string, string> = {
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
}

export function priceLevelSymbol(
  priceLevel: string | null | undefined,
): string | null {
  if (!priceLevel) return null
  return PRICE_LEVEL_SYMBOLS[priceLevel] ?? null
}
