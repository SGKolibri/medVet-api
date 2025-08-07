import { UsersRepository } from '@/repositories/users-repository';
import { Secretary } from '@prisma/client'
import { NoExistsUsersError } from '@/use-cases/errors/user-error'
import { hash } from 'bcryptjs';

interface UpdateUseCaseRequest {
  id: string
  name: string
  cpf: string
  email: string | null
  phone: string | null
  password?: string // Senha agora é opcional
}

interface UpdateUseCaseResponse {
  user: Secretary
}

export class UpdateSecretaryUseCase {

  constructor(private userRepository: UsersRepository) { }

  async execute({ id, name, email, cpf, phone, password }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {

    const userExists = await this.userRepository.findSecretaryById(id)

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
      phone
    };

    // Só inclui a senha se ela foi fornecida
    if (password_hash) {
      updateData.password_hash = password_hash;
    }

    const user = await this.userRepository.updateSecretary(id, updateData);

    return {
      user
    }
  }
}
