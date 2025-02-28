import { UsersRepository } from "@/repositories/users-repository";
import { teacherNoexists } from "@/use-cases/errors/teacher-error";
import { Teacher } from "@prisma/client";



interface SearchTeacherUseCaseRequest {
  query: string
  page: number
}

export class GetAllTeachersUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute(page: number, numberOfItems: number) {
    const users = await this.usersRepository.findAllTeachers(page, numberOfItems);

    if (users.length === 0) {
      throw new teacherNoexists()
    }

    return users;
  }
}


export class GetTeacherByIdUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute(id: string) {
    const user = await this.usersRepository.findTeacherById(id);


    if (user === null) {
      throw new teacherNoexists()
    }

    return user;
  }
}


export class GetTeachersByRegistrationUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute( query: string, page: number): Promise<Teacher[]> {
    const teacher = await this.usersRepository.searchByRegistrationTeachers(query, page);

    if (teacher.length === 0) {
      throw new teacherNoexists()
    }

    return teacher
  }
}


export class SearchTeacherByNameUseCase {
  constructor(private userRepository: UsersRepository) { }

  async execute(query: string, page: number) {


    const user = await this.userRepository.findTeacherByName(query, page)

    if (user.length === 0 || query.length == 0) {
      throw new teacherNoexists()
    }

    return user


  }

}


