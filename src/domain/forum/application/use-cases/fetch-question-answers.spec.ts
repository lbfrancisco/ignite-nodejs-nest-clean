import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionsAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionsAnswersUseCase

describe('Fetch Questions Answers Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchQuestionsAnswersUseCase(answersRepository)
  })

  it('should be able to fetch questions answers', async () => {
    const questionId = 'sut-question-id'

    Array.from({ length: 3 }).forEach(async () => {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID(questionId) }),
      )
    })

    const result = await sut.execute({
      questionId,
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated questions answers', async () => {
    const questionId = 'sut-question-id'

    Array.from({ length: 35 }).forEach(async () => {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID(questionId) }),
      )
    })

    const result = await sut.execute({
      questionId,
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(15)
    }
  })
})
