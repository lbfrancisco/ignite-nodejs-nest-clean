import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('should be able to authenticate with valid credentials', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
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
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'invalid.email@mail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@mail.com',
      password: 'invalid-password',
    })

    expect(response.statusCode).toEqual(401)
  })
})
