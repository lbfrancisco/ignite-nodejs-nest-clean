import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/now-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EditAnswerCommentUseCase } from './edit-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: EditAnswerCommentUseCase

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new EditAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to edit a answer comment', async () => {
    const answerComment = makeAnswerComment(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await answerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'This is my new content',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answerComment.content).toEqual(
        'This is my new content',
      )
    }
  })

  it('should not be able to edit another user answer comment', async () => {
    const answerComment = makeAnswerComment(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await answerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'This is my new content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a non-existing answer comment', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'non-existing-id',
      content: 'This is my new content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
