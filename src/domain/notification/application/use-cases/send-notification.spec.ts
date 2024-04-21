import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationRepository)
  })

  it('should be able to create a new notification', async () => {
    const result = await sut.execute({
      recipientId: 'sut-recipient-id',
      title: 'New Notification',
      content: 'This is a new notification',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.notification.content).toEqual(
        'This is a new notification',
      )
    }
  })
})
