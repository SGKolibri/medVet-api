import {
  getTermosAnestesiaController,
  createTermoAnestesiaController,
  updateTermoAnestesiaController,
  getTermoAnestesiaByIdController,
  deleteTermoAnestesiaController,
  getTermoAnestesiaPdfController,
} from "./termo-anestesia.controller";
import { FastifyInstance } from "fastify";
import { createTermoAnestesiaSchema, CreateTermoAnestesiaInput } from "./termo-anestesia.schema";

export default async function TermoAnestesiaRoutes(app: FastifyInstance) {
  app.get(
    "/get/termos-anestesia",
    {
      preHandler: [app.authenticate],
    },
    getTermosAnestesiaController
  );

  app.post<{ Body: CreateTermoAnestesiaInput }>(
    "/create/termo-anestesia",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createTermoAnestesiaSchema,
      },
    },
    createTermoAnestesiaController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo-anestesia/:id",
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
    getTermoAnestesiaByIdController
  );

  app.put<{ Params: { id: string }; Body: CreateTermoAnestesiaInput }>(
    "/update/termo-anestesia/:id",
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
        body: createTermoAnestesiaSchema,
      },
    },
    updateTermoAnestesiaController
  );

  app.delete<{ Params: { id: string } }>(
    "/delete/termo-anestesia/:id",
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
    deleteTermoAnestesiaController
  );

  app.get<{ Params: { id: string } }>(
    "/get/termo-anestesia/:id/pdf",
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
    getTermoAnestesiaPdfController
  );
}
