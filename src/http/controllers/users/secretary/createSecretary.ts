import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterUseCase } from "@/use-cases/factories/users/secretary/make-create-secretarys";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-error";
import { Validation } from "@/utils/validation";
import { error } from "console";

export async function createSecretary(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.union([z.literal(""), z.string().email()]).nullable(),
    cpf: z.string(),
    password: z.string(),
    phone: z.string().nullable(),
  });

  /*
    example request body:
    {
      "name": "Fernanda Lima",
      "email": "fernanda@example.com",
        "cpf": "456.456.456-45",
        "password": "123456",
        "phone": "123456789"
    }
  */

  const { name, email, cpf, password, phone } = registerBodySchema.parse(
    request.body
  );

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      cpf,
      password,
      phone,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply
        .status(409)
        .send({ message: "Usuário já existe", error: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
