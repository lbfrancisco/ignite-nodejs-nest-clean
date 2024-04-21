import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface StudentProps {
  name: string
  email: string
  password: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  set name(name) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email) {
    this.props.email = email
  }

  get password() {
    return this.props.password
  }

  set password(password) {
    this.props.password = password
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(
      {
        ...props,
      },
      id,
    )

    return student
  }
}
