import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let studentsRepository: InMemoryStudentsRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let sut: AuthenticateStudentUseCase

describe('Authenticate Student Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    sut = new AuthenticateStudentUseCase(
      studentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    await studentsRepository.create(
      makeStudent({
        email: 'john.doe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.accessToken).toBeTruthy()
    }
  })

  it('should not be able to authenticate a student with wrong e-mail', async () => {
    await studentsRepository.create(
      makeStudent({
        email: 'john.doe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'random@mail.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate a student with wrong password', async () => {
    await studentsRepository.create(
      makeStudent({
        email: 'john.doe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'john.doe@example.com',
      password: 'random-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
