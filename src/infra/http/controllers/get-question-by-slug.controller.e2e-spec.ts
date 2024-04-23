import request from 'supertest'

import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'

describe('Get Question By Slug (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('should be able to get a question by slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: question.title }),
    })
  })
})
