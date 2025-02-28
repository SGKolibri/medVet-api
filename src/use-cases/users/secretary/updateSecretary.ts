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
  password: string
}

interface UpdateUseCaseResponse {
  user: Secretary
}

export class UpdateSecretaryUseCase {

  constructor(private userRepository: UsersRepository) { }

  async execute({ id, name, email, cpf, phone, password }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {

    const password_hash = await hash(password, 6)

    const userExists = await this.userRepository.findSecretaryById(id)


    if (userExists) {
      const user = await this.userRepository.updateSecretary(id, {
        name,
        email,
        cpf,
        phone,
        password_hash
      })

      return {
        user
      }
    } else {
      throw new NoExistsUsersError()
    }
  }
}
