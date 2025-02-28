import { UsersRepository } from '@/repositories/users-repository'

import { Secretary } from '@prisma/client'  //tipagem propria do prisma
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../../errors/user-error'

interface RegisterUseCaseRequest {
  name: string
  cpf: string
  password: string
  email: string | null
  phone: string | null
}

interface RegisterUseCaseResponse {
  user: Secretary
}



export class CreateSecretarysUseCase {  //cada classe tem um método
  constructor(private usersRepository: UsersRepository) { }   //receber as dependencia dentro do construtor
  //retorna isso
  async execute({ name, email, cpf, password, phone }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {

    const password_hash = await hash(password, 6)

    const userWithSameCpf = await this.usersRepository.findByCpfSecretary(cpf)

    if (userWithSameCpf) { //se o usuario existe
      throw new UserAlreadyExistsError()
    }


    //recebendo repositorio do construtor
    const user = await this.usersRepository.createSecretarys({   //cria o usuario no banco de dados
      name,
      email,
      cpf,
      password_hash,
      phone
    })

    return {
      user
    }
  }
}
