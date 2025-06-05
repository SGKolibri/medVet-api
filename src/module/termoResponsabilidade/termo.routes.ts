import {
  getTermosController,
  createTermoController,
  updateTermoController,
  getTermoByIdController,
  deleteTermoController,
  getTermoPdfController,
  generateTermoInternacaoPdfController,
} from "./termo.controller";
import { FastifyInstance } from "fastify";
import { createTermoSchema, CreateTermoInput } from "./termo.schema";

export default async function TermoRoutes(app: FastifyInstance) {
  app.get(
    "/get/termos",
    getTermosController
  );

  app.post<{ Body: CreateTermoInput }>(
    "/create/termo",
    {
      schema: {
        body: createTermoSchema,
      },
    },
    createTermoController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo/:id",
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
    getTermoByIdController
  );
  app.put<{ Params: { id: string }; Body: CreateTermoInput }>(
    "/update/termo/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: createTermoSchema,
      },
    },
    updateTermoController
  );

  app.delete<{ Params: { id: string } }>(
    "/delete/termo/:id",
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
    deleteTermoController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo/:id/pdf",
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
    getTermoPdfController
  );
  app.post(
    "/generate/termo-internacao-pdf",
    generateTermoInternacaoPdfController
  );
}
