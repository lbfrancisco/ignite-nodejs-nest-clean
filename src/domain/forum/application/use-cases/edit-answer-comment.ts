import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/now-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

interface EditAnswerCommentUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type EditAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answerComment: AnswerComment }
>

export class EditAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerCommentUseCaseRequest): Promise<EditAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(answerId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    answerComment.content = content

    await this.answerCommentsRepository.save(answerComment)

    return right({ answerComment })
  }
}
