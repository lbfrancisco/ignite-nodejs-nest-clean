import { OnAnswerCommentCreated } from '@/domain/notification/application/subscribers/on-answer-comment-created'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { OnQuestionCommentCreated } from '@/domain/notification/application/subscribers/on-question-comment-created'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    OnAnswerCommentCreated,
    OnQuestionCommentCreated,
    SendNotificationUseCase,
  ],
})
export class EventModule {}
