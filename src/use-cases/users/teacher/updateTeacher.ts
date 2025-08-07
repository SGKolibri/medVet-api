import { UsersRepository } from '@/repositories/users-repository';
import { Teacher } from '@prisma/client'
import { hash } from 'bcryptjs';
import { teacherNoexists } from '@/use-cases/errors/teacher-error';

interface UpdateUseCaseRequest {
  id: string
  name: string
  cpf: string
  password?: string // Senha agora é opcional
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

    if (!userExists) {
      throw new teacherNoexists()
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
      shift
    };

    // Só inclui a senha se ela foi fornecida
    if (password_hash) {
      updateData.password_hash = password_hash;
    }

    const user = await this.userRepository.updateTeacher(id, updateData);

    return {
      user
    }
  }
}