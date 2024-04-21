import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch questions comments', async () => {
    const questionId = 'sut-question-id'

    Array.from({ length: 3 }).forEach(async () => {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID(questionId) }),
      )
    })

    const result = await sut.execute({
      questionId,
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questionComments).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated question comments', async () => {
    const questionId = 'sut-question-id'

    Array.from({ length: 35 }).forEach(async () => {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID(questionId) }),
      )
    })

    const result = await sut.execute({
      questionId,
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questionComments).toHaveLength(15)
    }
  })
})
