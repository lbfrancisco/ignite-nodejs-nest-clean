import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  overwrite: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Notification.create(
    {
      recipientId: overwrite.recipientId ?? new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      ...overwrite,
    },
    id,
  )

  return answer
}
