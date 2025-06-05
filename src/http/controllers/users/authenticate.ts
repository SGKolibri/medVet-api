import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAuthenticateUseCase } from "@/use-cases/factories/users/make-authenticate-use-case";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { Validation } from "@/utils/validation";
import { app } from "@/app";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    cpf: z.string(),
    password: z.string().min(6),
  });

  const { cpf, password } = authenticateBodySchema.parse(request.body);



  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      cpf,
      password,
    });

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "20m",
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      //criar o refresh token
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "30m",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
      
        path: "/", 
        secure: true, 
        sameSite: true, 
        httpOnly: true, 
      })
      .status(200)
      .send({
        user,
        token,
       
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
