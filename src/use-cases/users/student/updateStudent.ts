import { UsersRepository } from '@/repositories/users-repository';
import { Student } from '@prisma/client'
import { NoExistsUsersError } from '@/use-cases/errors/user-error'
import { hash } from 'bcryptjs';

interface UpdateUseCaseRequest {
  id: string
  name: string
  cpf: string
  email: string | null
  phone: string | null
  password: string
  registration: string
  course: string | null
  shift: string | null
  period: string | null
}

interface UpdateUseCaseResponse {
  user: Student
}

export class UpdateStudentUseCase {

  constructor(private userRepository: UsersRepository) { }

  async execute({ id, name, email, cpf, password, registration, course, shift, period, phone }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse>{


    const userExists = await this.userRepository.findStudentById(id)

    const password_hash = await hash(password, 6)

    if (userExists) {
      const user = await this.userRepository.updateStudent(id, {
        name,
        email,
        cpf,
        phone,
        password_hash,
        registration,
        course,
        shift, 
        period
      })

      return {
        user
      }
    } else {
      throw new NoExistsUsersError()
    }
  }
}