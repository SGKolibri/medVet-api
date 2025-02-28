import { createStudent } from "./student/createStudents";
import { createTeacher } from "./teacher/createTeachers";
import { createSecretary } from "./secretary/createSecretary";
import { authenticate } from "@/http/controllers/users/authenticate";
import { refresh } from "@/http/controllers/users/refresh";

import { studentSchema } from "@/docs/swagger/studentSchema";
import { teacherSchema } from "@/docs/swagger/teacherSchema";
import { secretarySchema } from "@/docs/swagger/secretarySchema";
import { sessionsSchema } from "@/docs/swagger/sessionsSchema";
import { getAllStudentsSchema } from "@/docs/swagger/getAllStudentSchema";
import { getStudentByIdSchema } from "@/docs/swagger/getStudentByIdSchema";
import { getStudentByRegistrationSchema } from "@/docs/swagger/getStudentByRegistrationSchema";
import { getAllTeachersSchema } from "@/docs/swagger/getAllTeachersSchema";
import { getTeacherByIdSchema } from "@/docs/swagger/getTeacherByIdSchema";
import { getTeachersByRegistrationSchema } from "@/docs/swagger/getTeachersByRegistrationSchema";

import { FastifyInstance } from "fastify";
import {
  getAllStudent,
  getStudentById,
  searchStudentByName,
  searchStudentByRegistration,
} from "./student/getStudent";
import {
  getAllTeachers,
  getTeacherById,
  getTeacherByName,
  getTeachersByRegistration,
} from "./teacher/getTeachers";
import { updateSecretary } from "./secretary/updateSecretary";
import { updateStudent } from "./student/updateStudent";
import { updateTeacher } from "./teacher/updateTeacher";
import { deleteSecretary } from "./secretary/deleteSecretary";
import { deleteStudent } from "./student/deleteStudent";
import { deleteTeacher } from "./teacher/deleteTeacher";
import { validate } from "uuid";
import { validateToken } from "../validateToken";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/validate-token", validateToken); // validação de token

  app.post("/users/student", createStudent);
  app.post("/users/teacher", createTeacher);
  app.post("/users/secretary", createSecretary);

  app.post("/sessions", { schema: sessionsSchema }, authenticate); //seção de authenticate
  app.patch("/token/refresh", refresh);

  app.get("/get/student", getAllStudent);
  app.get("/get/student/id/:id", getStudentById); // buscar Student pelo id
  app.get("/get/student/registration", searchStudentByRegistration); // buscar student pelo registration
  app.get("/get/student/name", searchStudentByName); // buscar student pelo nome

  app.get("/get/teacher", getAllTeachers);
  app.get("/get/teacher/id/:id", getTeacherById);
  app.get("/get/teacher/registration", getTeachersByRegistration);
  app.get("/get/teacher/name", getTeacherByName);

  app.put("/put/secretary", updateSecretary);
  app.put("/put/student", updateStudent);
  app.put("/put/teacher", updateTeacher);

  app.patch("/delete/teacher", deleteTeacher);
  app.patch("/delete/secretary", deleteSecretary);
  app.patch("/delete/student", deleteStudent);
}
