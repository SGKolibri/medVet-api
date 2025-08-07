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
  password?: string
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

    if (!userExists) {
      throw new NoExistsUsersError()
    }

    // Só criptografa a senha se ela foi fornecida
    let password_hash: string | undefined;
    if (password) {
      password_hash = await hash(password, 6);
    }

    // Monta os dados para atualização, incluindo senha apenas se fornecida
    const updateData: any = {
      name,
      email,
      cpf,
      phone,
      registration,
      course,
      shift, 
      period
    };

    // Só inclui a senha se ela foi fornecida
    if (password_hash) {
      updateData.password_hash = password_hash;
    }

    const user = await this.userRepository.updateStudent(id, updateData);

    return {
      user
    }
  }
}