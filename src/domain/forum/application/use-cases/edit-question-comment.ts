import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/now-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'

interface EditQuestionCommentUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type EditQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { questionComment: QuestionComment }
>

export class EditQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionId,
    content,
  }: EditQuestionCommentUseCaseRequest): Promise<EditQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    questionComment.content = content

    await this.questionCommentsRepository.save(questionComment)

    return right({ questionComment })
  }
}
