import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      attachments: answer.attachments,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
