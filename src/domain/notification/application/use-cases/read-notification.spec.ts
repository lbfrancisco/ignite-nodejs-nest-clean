import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/now-allowed-error'

let notificationRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await notificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.notification.readAt).toEqual(expect.any(Date))
    }
  })

  it('should be able to read a notification from another user', async () => {
    const notification = makeNotification()

    await notificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'another-user-id',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
