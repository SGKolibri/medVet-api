import { NoExistsUsersError } from "@/use-cases/errors/user-error"
import { UsersRepository } from "@/repositories/users-repository"

interface MarkAsDeleteUseCaseRequest {
  id: string
}

export class MarkAsDeleteSecretaryUseCase {

  constructor(
    private usersRepository: UsersRepository
  ) { }

  async execute({ id }: MarkAsDeleteUseCaseRequest) {


    const userExists = await this.usersRepository.findSecretaryById(id)

    if (!userExists) {
      throw new NoExistsUsersError()
    }

    await this.usersRepository.markSecretaryAsDelete(id)

  }
}
