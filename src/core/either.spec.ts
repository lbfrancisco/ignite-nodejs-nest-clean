import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(1)
  } else {
    return left('error')
  }
}

it('should be a result of success', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
})

it('should be a result of error', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
})
