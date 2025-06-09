import { TutorAlreadyExistsError } from "@/use-cases/errors/tutor-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterUseCase } from "@/use-cases/factories/tutor/make-create-tutors";
import { Validation } from "@/utils/validation";
import { normalize } from "path";

export async function createTutor(
  request: FastifyRequest<{ Body: any }>,
  reply: FastifyReply
) {
  console.log("Received request to create tutor:", request.body);

  const registerBodySchema = z.object({
    name: z.string(),
    cpf: z.string().optional(),
    adress: z.string().nullable(),
    phone: z.string().refine(Validation.isValidPhoneNumber, {
      message: "Numero de contato inválido",
    }),
    email: z
      .union([z.literal(""), z.string().email()])
      .nullable()
      .optional(),
  });

  console.log("Registering tutor...");

  const { name, cpf, phone, email, adress } = registerBodySchema.parse(
    request.body
  );

  const normalizedCpf = cpf ?? null;
  const normalizedEmail = email ?? null;

  try {
    const registerUserCase = makeRegisterUseCase();

    await registerUserCase.execute({
      name,
      cpf: normalizedCpf,
      phone,
      email: normalizedEmail,
      adress,
    });
    console.log("Tutor registered successfully");
  } catch (err) {
    if (err instanceof TutorAlreadyExistsError) {
      console.error("Tutor already exists:", err.message);
      return reply.status(409).send({ message: err.message });
    }
    console.error("Error registering tutor:", err);
    throw err;
  }

  return reply.status(201).send();
}
