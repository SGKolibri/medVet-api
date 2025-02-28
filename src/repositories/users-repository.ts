import { dataGetAllStudent, dataGetAllTeacher } from "@/@types/return-type";
import { Prisma, Secretary, Student, Teacher } from "@prisma/client";

export interface UsersRepository {
  //teacher
  findTeacherById(id: string): Promise<Teacher | null>;
  findByRegistrationTeachers(registration: string): Promise<Teacher | null>;
  searchByRegistrationTeachers(query: string, page: number): Promise<Teacher[]>;
  findAllTeachers(
    page: number,
    numberOfItems: number
  ): Promise<dataGetAllTeacher>;
  findByCpfTeacher(cpf: string): Promise<Teacher | null>;
  createTeachers(data: Prisma.TeacherCreateInput): Promise<Teacher>;
  updateTeacher(id: string, data: Prisma.TeacherUpdateInput): Promise<Teacher>;
  findTeacherByName(query: string, page: number): Promise<Teacher[]>;
  markTeacherAsDelete(id: string): any;
  findAllTeachersDeleted(): Promise<Teacher[]>;

  //student
  findStudentById(id: string): Promise<Student | null>;
  findByRegistrationStudent(registration: string): Promise<Student | null>;
  findAllStudent(
    page: number,
    numberOfItems: number
  ): Promise<dataGetAllStudent>;
  findByCpfStudent(cpf: string): Promise<Student | null>;
  createStudent(data: Prisma.StudentCreateInput): Promise<Student>;
  searchStudentByRegistration(q: string, page: number): Promise<Student[]>;
  findStudentByName(name: string, page: number): Promise<Student[]>;

  updateStudent(id: string, data: Prisma.StudentUpdateInput): Promise<Student>;
  markStudentAsDelete(id: string): any;

  //secretary
  findSecretaryById(id: string): Promise<Secretary | null>;
  findByCpfSecretary(cpf: string): Promise<Secretary | null>;
  createSecretarys(data: Prisma.SecretaryCreateInput): Promise<Secretary>;
  updateSecretary(
    id: string,
    data: Prisma.SecretaryUpdateInput
  ): Promise<Secretary>;
  markSecretaryAsDelete(id: string): any;
}
