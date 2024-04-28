import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'sut-author-id',
      title: 'New Question',
      content: 'This is my new question',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question.content).toEqual('This is my new question')
      expect(result.value.question.attachments.currentItems).toHaveLength(2)
      expect(result.value.question.attachments.currentItems).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ])
    }
  })

  it('should be able to persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: 'sut-author-id',
      title: 'New Question',
      content: 'This is my new question',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(questionAttachmentsRepository.items).toHaveLength(2)
      expect(questionAttachmentsRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            attachmentId: new UniqueEntityID('1'),
          }),
          expect.objectContaining({
            attachmentId: new UniqueEntityID('2'),
          }),
        ]),
      )
    }
  })
})
