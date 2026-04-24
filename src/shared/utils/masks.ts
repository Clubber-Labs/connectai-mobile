export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  const mid = d.length <= 10 ? 6 : 7
  return `(${d.slice(0, 2)}) ${d.slice(2, mid)}-${d.slice(mid)}`
}
