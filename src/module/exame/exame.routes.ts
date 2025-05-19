import {
  getExamesController,
  createExameController,
  updateExameController,
  getExameByIdController,
  deleteExameController,
} from "./exame.controller";
import { FastifyInstance } from "fastify";
import { createExameSchema, CreateExameInput } from "./exame.schema";

export default async function ExameRoutes(app: FastifyInstance) {
  app.get(
    "/get/exames",
    {
      preHandler: [app.authenticate],
    },
    getExamesController
  );

  app.post<{ Body: CreateExameInput }>(
    "/create/exame",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createExameSchema,
      },
    },
    createExameController
  );

  app.get<{ Params: { id: string } }>(
    "/get/exame/:id",
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
    getExameByIdController
  );

  app.put<{ Params: { id: string }; Body: CreateExameInput }>(
    "/update/exame/:id",
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
        body: createExameSchema,
      },
    },
    updateExameController
  );

  app.delete<{ Params: { id: string } }>(
    "/delete/exame/:id",
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
    deleteExameController
  );
}
