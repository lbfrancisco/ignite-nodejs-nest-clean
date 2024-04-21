import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch paginated recent questions', async () => {
    Array.from({ length: 35 }).forEach(async () => {
      await questionsRepository.create(makeQuestion())
    })

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questions).toHaveLength(15)
    }
  })

  it('should be able to fetch recent questions ordered by created at', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )

    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 15) }),
    )

    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 10) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questions).toHaveLength(3)
      expect(result.value.questions).toEqual([
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 15) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 10) }),
      ])
    }
  })
})
