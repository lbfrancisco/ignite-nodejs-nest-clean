import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../enterprise/entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class AnswerCreateEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.ocurredAt = new Date()
    this.answer = answer
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
