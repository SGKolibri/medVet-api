import { UsersRepository } from '@/repositories/users-repository';
import { Teacher } from '@prisma/client'
import { hash } from 'bcryptjs';
import { teacherNoexists } from '@/use-cases/errors/teacher-error';

interface UpdateUseCaseRequest {
  id: string
  name: string
  cpf: string
  password: string
  email: string | null
  registration: string
  course: string | null
  shift: string | null
  phone: string | null
}

interface UpdateUseCaseResponse {
  user: Teacher
}

export class UpdateTeacherUseCase {

  constructor(private userRepository: UsersRepository) { }

  async execute({ id, name, email, cpf, password, registration, course, shift, phone }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {


    const userExists = await this.userRepository.findTeacherById(id)

    const password_hash = await hash(password, 6)



    if (!userExists) {
      throw new teacherNoexists()
    } else {

      const user = await this.userRepository.updateTeacher(id, {
        name,
        email,
        cpf,
        phone,
        password_hash,
        registration,
        course,
        shift
      })


      return {
        user
      }
    }



  }
}