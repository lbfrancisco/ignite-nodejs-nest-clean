import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  it('should be able to authenticate with valid credentials', async () => {
    await studentFactory.makePrismaStudent({
      email: 'john.doe@mail.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@mail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toMatchObject({
      access_token: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong email', async () => {
    await studentFactory.makePrismaStudent({
      email: 'john.doe2@mail.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'wrong.email@mail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await studentFactory.makePrismaStudent({
      email: 'john.doe3@mail.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@mail.com',
      password: 'wrong-password',
    })

    expect(response.statusCode).toEqual(401)
  })
})
