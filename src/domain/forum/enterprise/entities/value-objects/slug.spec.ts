import { Slug } from './slug'

describe('Slug Value Object', () => {
  it('should be able to create a new slug from text', async () => {
    const slug = Slug.createFromText('This is a example title')

    expect(slug.value).toEqual('this-is-a-example-title')
  })
})
