import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";

import { ZodError } from "zod";
import { env } from "@/env";

import { usersRoutes } from "@/http/controllers/users/routes";
import { tutorRoutes } from "@/http/controllers/tutors/routes";
import { consultRoutes } from "@/http/controllers/consults/routes";
import { enchiridionRoutes } from "@/http/controllers/enchiridion/routes";
import { animalsRoutes } from "@/http/controllers/animals/routes";
import { attachmentRoutes } from "@/http/controllers/attachement/routes";
import ExameRoutes from "./module/exame/exame.routes";

import { FastifyReply, FastifyRequest } from "fastify";

import { prescriptionRoutes } from "./http/controllers/prescription/routes";
import { vaccinationRoutes } from "./http/controllers/vaccination/routes";
import TermoRoutes from "./module/termoResponsabilidade/termo.routes";
import TermoInternacaoRoutes from "./module/termoInternacao/termo-internacao.routes";
import TermoAnestesiaRoutes from "./module/termoAnestesia/termo-anestesia.routes";
import { termoConsultaRoutes } from "./module/termoConsulta/termoConsulta.routes";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "1m", //expiração do token original, 10 min
  },
});

app.decorate(
  "authenticate", // name of the decorator
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

app.register(fastifyCookie);

app.register(fastifyMultipart, {
  attachFieldsToBody: true,
});

app.register(usersRoutes);
app.register(tutorRoutes);
app.register(consultRoutes);
app.register(enchiridionRoutes);
app.register(animalsRoutes);
app.register(prescriptionRoutes);
app.register(vaccinationRoutes);
app.register(attachmentRoutes);
app.register(ExameRoutes);
app.register(TermoRoutes);
app.register(TermoInternacaoRoutes);
app.register(TermoAnestesiaRoutes);
app.register(termoConsultaRoutes);

app.setErrorHandler((error, _, reply) => {
  //função que lida com erros

  if (error instanceof ZodError) {
    //for de erro de validação
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
