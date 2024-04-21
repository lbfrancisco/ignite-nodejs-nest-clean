import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/now-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EditQuestionCommentUseCase } from './edit-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: EditQuestionCommentUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new EditQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to edit a question comment', async () => {
    const questionComment = makeQuestionComment(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await questionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      content: 'This is my new content',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questionComment.content).toEqual(
        'This is my new content',
      )
    }
  })

  it('should not be able to edit another user question comment', async () => {
    const questionComment = makeQuestionComment(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await questionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      content: 'This is my new content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a non-existing question comment', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'non-existing-id',
      content: 'This is my new content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
