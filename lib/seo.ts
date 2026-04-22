export function stripBrand(title: string | undefined | null): string | undefined {
  if (!title) return undefined
  return title
    .replace(/\s*[|\u2014\-–]\s*Just Acoustics(?:\s+Shop)?\s*$/i, '')
    .trim()
}
