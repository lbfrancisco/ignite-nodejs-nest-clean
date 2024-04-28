import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let studentsRepository: InMemoryStudentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answers comments', async () => {
    const student = makeStudent()

    studentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await answerCommentsRepository.create(comment1)
    await answerCommentsRepository.create(comment2)
    await answerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
      expect(result.value.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: student.name,
            commentId: comment1.id.toString(),
          }),
          expect.objectContaining({
            author: student.name,
            commentId: comment2.id.toString(),
          }),
          expect.objectContaining({
            author: student.name,
            commentId: comment3.id.toString(),
          }),
        ]),
      )
    }
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent()

    studentsRepository.items.push(student)

    Array.from({ length: 35 }).forEach(async () => {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    })

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(15)
    }
  })
})
