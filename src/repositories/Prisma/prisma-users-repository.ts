import { UsersRepository } from "@/repositories/users-repository";
import { prisma } from "@/lib/prisma";
import { Prisma, Secretary, Student, Teacher } from "@prisma/client";
import { dataGetAllStudent, dataGetAllTeacher } from "@/@types/return-type";

export class PrismaUsersRepository implements UsersRepository {
  async findStudentById(id: string) {
    const user = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByRegistrationStudent(registration: string) {
    const user = await prisma.student.findUnique({
      where: {
        registration,
      },
    });
    return user;
  }

  async searchStudentByRegistration(q: string, page: number) {
    const user = await prisma.student.findMany({
      where: {
        registration: {
          startsWith: q,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });
    return user;
  }

  async findAllStudent(
    page: number,
    numberOfItems: number
  ): Promise<dataGetAllStudent> {
    const numberCount = await prisma.student.count();

    const numberOfPages = Math.floor((numberCount - 1) / numberOfItems);

    const skipItens = (page - 1) * numberOfItems;

    const users = await prisma.student.findMany({
      take: numberOfItems,
      skip: skipItens,
    });

    const usersWithPasswordHash = users.map((user) => ({
      ...user,
      password_hash: "",
    }));

    const data: dataGetAllStudent = {
      numberOfPages: numberOfPages + 1,
      student: usersWithPasswordHash,
    };

    return data;
  }

  async findStudentByName(query: string, page: number): Promise<Student[]> {
    const queryNormalized = query.toLowerCase();

    const student = await prisma.student.findMany({
      where: {
        name: {
          contains: queryNormalized,
          mode: "insensitive",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return student;
  }

  async findByCpfStudent(cpf: string) {
    const user = await prisma.student.findUnique({
      // Este comando usa o Prisma para buscar um usuário único no banco de dados onde o campo de e-mail corresponde ao e-mail fornecido.
      where: {
        cpf,
      },
    });

    return user;
  }

  async createStudent(data: Prisma.StudentCreateInput) {
    //cria no banco de dados
    const user = await prisma.student.create({
      data,
    });

    return user;
  }

  async updateStudent(
    id: string,
    data: Prisma.StudentUpdateInput
  ): Promise<Student> {
    const user = await prisma.student.update({
      where: {
        id: id,
      },
      data,
    });

    return user;
  }

  async markStudentAsDelete(id: string) {
    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        status_delete: true,
      },
    });
  }

  //Teacher
  async findTeacherById(id: string) {
    const user = await prisma.teacher.findUnique({
      //pelo teacher retorna o usuário
      where: {
        id,
      },
    });

    return user;
  }

  async findByRegistrationTeachers(registration: string) {
    const user = await prisma.teacher.findUnique({
      where: {
        registration,
      },
    });

    return user;
  }

  async searchByRegistrationTeachers(query: string, page: number) {
    const user = await prisma.teacher.findMany({
      where: {
        registration: {
          startsWith: query,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return user;
  }

  async findAllTeachers(
    page: number,
    numberOfItems: number
  ): Promise<dataGetAllTeacher> {
    const count = await prisma.teacher.count();

    const numberOfPages = Math.floor((count - 1) / numberOfItems);

    const skipItems = (page - 1) * numberOfItems;

    const users = await prisma.teacher.findMany({
      take: numberOfItems,
      skip: skipItems,
    });

    const usersWithPasswordHash = users.map((user) => ({
      ...user,
      password_hash: "",
    }));

    const data: dataGetAllTeacher = {
      numberOfPages: numberOfPages + 1,
      teacher: usersWithPasswordHash,
    };

    return data;
  }

  async findByCpfTeacher(cpf: string) {
    const user = await prisma.teacher.findUnique({
      where: {
        cpf,
      },
    });

    return user;
  }

  async findTeacherByName(query: string, page: number): Promise<Teacher[]> {
    const queryNormalized = query.toLowerCase();

    const teacher = await prisma.teacher.findMany({
      where: {
        name: {
          contains: queryNormalized,
          mode: "insensitive",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return teacher;
  }

  async createTeachers(data: Prisma.TeacherCreateInput) {
    //cria no banco de dados
    const user = await prisma.teacher.create({
      data,
    });

    return user;
  }

  async markTeacherAsDelete(id: string) {
    await prisma.teacher.update({
      where: {
        id: id,
      },
      data: {
        status_delete: true,
      },
    });
  }

  async updateTeacher(
    id: string,
    data: Prisma.TeacherUpdateInput
  ): Promise<Teacher> {
    const user = await prisma.teacher.update({
      where: {
        id: id,
      },
      data,
    });

    return user;
  }

  async findAllTeachersDeleted(): Promise<Teacher[]> {
    const user = await prisma.teacher.findMany({
      where: {
        status_delete: true,
      },
    });
    return user;
  }

  //Secretary
  async findSecretaryById(id: string) {
    const user = await prisma.secretary.findUnique({
      //pelo id retorna o usuário
      where: {
        id,
      },
    });

    return user;
  }

  async findByCpfSecretary(cpf: string) {
    const user = await prisma.secretary.findUnique({
      // Este comando usa o Prisma para buscar um usuário único no banco de dados onde o campo de e-mail corresponde ao e-mail fornecido.
      where: {
        cpf,
      },
    });

    return user;
  }

  async createSecretarys(data: Prisma.TeacherCreateInput) {
    //cria no banco de dados
    const user = await prisma.secretary.create({
      data,
    });

    return user;
  }

  async updateSecretary(
    id: string,
    data: Prisma.SecretaryUpdateInput
  ): Promise<Secretary> {
    const user = await prisma.secretary.update({
      where: {
        id: id,
      },
      data,
    });

    return user;
  }

  async markSecretaryAsDelete(id: string) {
    await prisma.secretary.update({
      where: {
        id: id,
      },
      data: {
        status_delete: true,
      },
    });
  }
}
