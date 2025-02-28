import { FastifyRequest, FastifyReply } from "fastify";
import {
  GetAllStudentsUseCase,
  GetStudentByIdUseCase,
  searchStudentByRegistrationUseCase,
} from "@/use-cases/users/student/getStudent";
import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository";
import { z } from "zod";
import { NoExistsUsersError } from "@/use-cases/errors/user-error";
import { studentNotFound } from "@/use-cases/errors/student-errors";
import {
  makeSearchStudentByRegistration,
  makeSearchStudentByName,
} from "@/use-cases/factories/users/student/make-search-student";

interface Params {
  id: string;
  registration: string;
}

export async function getAllStudent(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getQuerySchema = z.object({
    page: z.coerce.number(),
    numberOfItems: z.coerce.number(),
  });

  const { page, numberOfItems } = getQuerySchema.parse(request.query);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const getUsersUseCase = new GetAllStudentsUseCase(prismaUsersRepository);

    const users = await getUsersUseCase.execute(page, numberOfItems);

    return reply.status(200).send(users);
  } catch (error) {
    if (error instanceof NoExistsUsersError) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}

export async function getStudentById(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const getStudentByIdUseCase = new GetStudentByIdUseCase(
      prismaUsersRepository
    );

    const { id } = request.params;

    const user = await getStudentByIdUseCase.execute(id);

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    });
  } catch (error) {
    if (error instanceof studentNotFound) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}

export async function searchStudentByRegistration(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchStudentQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  try {
    const { q, page } = searchStudentQuerySchema.parse(request.query);
    const searchStudentByRegistrationUseCase =
      makeSearchStudentByRegistration();

    const user = await searchStudentByRegistrationUseCase.execute(q, page);
    return reply.status(200).send(user);
  } catch (error) {
    if (error instanceof studentNotFound) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}

export async function searchStudentByName(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchStudentQuerySchema = z.object({
    name: z.string(),
    page: z.number().min(1).default(1),
  });
  try {
    const { name, page } = searchStudentQuerySchema.parse(request.query);
    const searchStudentByNameUseCase = makeSearchStudentByName();
    const user = await searchStudentByNameUseCase.execute(name, page);
    return reply.status(200).send(user);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return reply.status(400).send({ message: e.errors });
    }
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
