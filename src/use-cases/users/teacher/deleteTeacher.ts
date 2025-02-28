import { NoExistsUsersError } from "@/use-cases/errors/user-error"
import { UsersRepository } from "@/repositories/users-repository"

export class DeleteTeacherUseCase {

  constructor(
    private usersRepository: UsersRepository
  ) { }

  async execute(id: string) {

    const userExists = await this.usersRepository.findTeacherById(id);

    if (!userExists) {
      throw new NoExistsUsersError();
    };

    await this.usersRepository.markTeacherAsDelete(id);
  };

}
