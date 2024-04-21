export function generateSlug(text: string): string {
  const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  let slug = normalizedText.trim().replace(/\s+/g, '-').toLowerCase()
  slug = slug.replace(/[^a-z0-9-]+/g, '')

  if (slug.startsWith('-')) {
    slug = slug.substring(1)
  }

  return slug
}
