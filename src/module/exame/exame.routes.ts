import {
  getExamesController,
  createExameController,
  updateExameController,
  getExameByIdController,
  deleteExameController,
  getExamePdfController,
} from "./exame.controller";
import { FastifyInstance } from "fastify";
import { createExameSchema, CreateExameInput } from "./exame.schema";
import { prisma } from "@/lib/prisma";

interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

export default async function ExameRoutes(app: FastifyInstance) {
  app.get("/get/exames", getExamesController);

  app.post<{ 
    Body: CreateExameInput & {
      pdf?: MultipartFile;
      reason?: string;
      observations?: string;
    }
  }>(
    "/create/exame",
    {
      schema: {
        body: createExameSchema,
      },
    },
    createExameController
  );

  app.get<{ Params: { id: string } }>(
    "/get/exame/:id",
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
    getExameByIdController
  );

  app.put<{ Params: { id: string }; Body: CreateExameInput }>(
    "/update/exame/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: createExameSchema,
      },
    },
    updateExameController
  );
  app.delete<{ Params: { id: string } }>(
    "/delete/exame/:id",
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
    deleteExameController
  );

  app.get<{ Params: { id: string } }>(
    "/get/exame/:id/pdf",
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
    getExamePdfController
  );

  // Nova rota para buscar exames por animalId
  app.get<{ Params: { animalId: string } }>(
    "/get/exames/animal/:animalId",
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
        const exames = await prisma.exame.findMany({
          where: { animalId },
          orderBy: { dataSolicitacao: 'desc' },
        });
        return reply.status(200).send(exames);
      } catch (error) {
        console.error(`Erro ao buscar exames do animal ${animalId}:`, error);
        return reply.status(500).send({ error: "Erro ao buscar exames" });
      }
    }
  );
}
