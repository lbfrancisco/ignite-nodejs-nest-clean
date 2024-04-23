import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

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

  it('should be able to fetch recent questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.questions).toHaveLength(2)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: expect.any(String) }),
        expect.objectContaining({ title: expect.any(String) }),
      ]),
    })
  })
})
