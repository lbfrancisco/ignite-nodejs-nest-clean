import { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { OnAnswerCommentCreated } from './on-answer-comment-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let answersRepository: InMemoryAnswersRepository
let notificationsRepository: NotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    answerCommentsRepository = new InMemoryAnswerCommentsRepository()

    notificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _event = new OnAnswerCommentCreated(
      answersRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification when a answer comment created', async () => {
    const answer = makeAnswer()
    const answerComment = makeAnswerComment({ answerId: answer.id })

    await answersRepository.create(answer)
    await answerCommentsRepository.create(answerComment)

    expect(sendNotificationExecuteSpy).toHaveBeenCalled()
  })
})
