import {
  getTermosInternacaoController,
  createTermoInternacaoController,
  updateTermoInternacaoController,
  getTermoInternacaoByIdController,
  deleteTermoInternacaoController,
  getTermoInternacaoPdfController,
} from "./termo-internacao.controller";
import { FastifyInstance } from "fastify";
import { createTermoInternacaoSchema, CreateTermoInternacaoInput } from "./termo-internacao.schema";
import { prisma } from "@/lib/prisma";

export default async function TermoInternacaoRoutes(app: FastifyInstance) {
  app.get(
    "/get/termos-internacao",
    {
      preHandler: [app.authenticate],
    },
    getTermosInternacaoController
  );

  app.post<{ Body: CreateTermoInternacaoInput }>(
    "/create/termo-internacao",
    {
      schema: {
        body: createTermoInternacaoSchema,
      },
    },
    createTermoInternacaoController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo-internacao/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    getTermoInternacaoByIdController
  );

  app.put<{ Params: { id: string }; Body: CreateTermoInternacaoInput }>(
    "/update/termo-internacao/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: createTermoInternacaoSchema,
      },
    },
    updateTermoInternacaoController
  );

  app.delete<{ Params: { id: string } }>(
    "/delete/termo-internacao/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    deleteTermoInternacaoController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo-internacao/:id/pdf",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    getTermoInternacaoPdfController
  );

  // Nova rota para buscar termos de internação por animalId
  app.get<{ Params: { animalId: string } }>(
    "/get/termos-internacao/animal/:animalId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            animalId: { type: "string" },
          },
          required: ["animalId"],
        },
      },
    },
    async (request, reply) => {
      const { animalId } = request.params;
      try {
        const termos = await prisma.termoResponsabilidadeInternacao.findMany({
          where: { animalId },
          orderBy: { createdAt: 'desc' },
        });
        return reply.status(200).send(termos);
      } catch (error) {
        console.error(`Erro ao buscar termos de internação do animal ${animalId}:`, error);
        return reply.status(500).send({ error: "Erro ao buscar termos de internação" });
      }
    }
  );
}
