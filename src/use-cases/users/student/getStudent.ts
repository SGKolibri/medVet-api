import { UsersRepository } from "@/repositories/users-repository";
import { NoExistsUsersError } from "../../errors/user-error";
import { studentNotFound } from "@/use-cases/errors/student-errors";

export class GetAllStudentsUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(page: number, numberOfItems: number) {
    const users = await this.usersRepository.findAllStudent(
      page,
      numberOfItems
    );

    if (!users) {
      throw new NoExistsUsersError();
    }

    return users;
  }
}

export class GetStudentByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.findStudentById(id);

    if (!user) {
      throw new studentNotFound();
    }

    return user;
  }
}

export class searchStudentByRegistrationUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(q: string, page: number) {
    const user = await this.usersRepository.searchStudentByRegistration(
      q,
      page
    );

    if (user.length === 0) {
      throw new studentNotFound();
    }

    return user;
  }
}

export class searchStudentByNameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(name: string, page: number) {
    const user = await this.usersRepository.d(name, page);

    if (user.length === 0) {
      throw new studentNotFound();
    }

    return user;
  }
}
