import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../enterprise/entities/answer-comment'

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this.ocurredAt = new Date()
    this.answerComment = answerComment
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id
  }
}
