import {
  getTermosController,
  createTermoController,
  updateTermoController,
  getTermoByIdController,
  deleteTermoController,
  getTermoPdfController,
} from "./termo.controller";
import { FastifyInstance } from "fastify";
import { createTermoSchema, CreateTermoInput } from "./termo.schema";

export default async function TermoRoutes(app: FastifyInstance) {
  app.get(
    "/get/termos",
    {
      preHandler: [app.authenticate],
    },
    getTermosController
  );

  app.post<{ Body: CreateTermoInput }>(
    "/create/termo",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createTermoSchema,
      },
    },
    createTermoController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo/:id",
    {
      preHandler: [app.authenticate],
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
      preHandler: [app.authenticate],
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
      preHandler: [app.authenticate],
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
      preHandler: [app.authenticate],
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
}
