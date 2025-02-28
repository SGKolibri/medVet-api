import { Student, Teacher, Tutor } from '@prisma/client'

export type dataGetAllTutor = {
  numberOfPages: number,
  tutor: Tutor[]
}

export type dataGetAllStudent = {
  numberOfPages: number,
  student: Student[]
}

export type dataGetAllTeacher = {
  numberOfPages: number,
  teacher: Teacher[]
}
