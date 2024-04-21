export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalize it as a slug
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    let slug = normalizedText.trim().replace(/\s+/g, '-').toLowerCase()
    slug = slug.replace(/[^a-z0-9-]+/g, '')

    if (slug.startsWith('-')) {
      slug = slug.substring(1)
    }

    return new Slug(slug)
  }
}
