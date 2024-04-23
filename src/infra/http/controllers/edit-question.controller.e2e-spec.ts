import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to edit a question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New content',
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New title',
        content: 'New content',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
