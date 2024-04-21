import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answers comments', async () => {
    const answerId = 'sut-answer-id'

    Array.from({ length: 3 }).forEach(async () => {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID(answerId) }),
      )
    })

    const result = await sut.execute({
      answerId,
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = 'sut-answer-id'

    Array.from({ length: 35 }).forEach(async () => {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID(answerId) }),
      )
    })

    const result = await sut.execute({
      answerId,
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(15)
    }
  })
})
