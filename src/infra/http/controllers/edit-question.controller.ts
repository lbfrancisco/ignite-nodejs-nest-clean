import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { z } from 'zod'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.editQuestion.execute({
      authorId: userId,
      questionId,
      title,
      content,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new ConflictException()
    }
  }
}
