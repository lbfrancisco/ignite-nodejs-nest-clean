import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let studentsRepository: InMemoryStudentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch questions comments', async () => {
    const student = makeStudent()

    studentsRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await questionCommentsRepository.create(comment1)
    await questionCommentsRepository.create(comment2)
    await questionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent()

    studentsRepository.items.push(student)

    Array.from({ length: 35 }).forEach(async () => {
      await questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    })

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(15)
    }
  })
})
