// src/http/routes/users.routes.ts
import { FastifyInstance } from "fastify";
import { 
  validateStudentUniqueFields, 
  validateTeacherUniqueFields, 
  validateSecretaryUniqueFields 
} from "../middlewares/validate-unique-fields";

// Importações de controllers
// ...

export async function usersRoutes(app: FastifyInstance) {
  // Rotas para estudantes
  app.post('/students', { preHandler: [validateStudentUniqueFields] }, async (request, reply) => {
    // Implementação existente ou chamada para o controller
  });

  app.put('/students/:id', { preHandler: [validateStudentUniqueFields] }, async (request, reply) => {
    // Implementação existente ou chamada para o controller
  });

  // Rotas para professores
  app.post('/teachers', { preHandler: [validateTeacherUniqueFields] }, async (request, reply) => {
    // Implementação existente ou chamada para o controller
  });

  app.put('/teachers/:id', { preHandler: [validateTeacherUniqueFields] }, async (request, reply) => {
    // Implementação existente ou chamada para o controller
  });

  // Rotas para secretários
  app.post('/secretaries', { preHandler: [validateSecretaryUniqueFields] }, async (request, reply) => {
    // Implementação existente ou chamada para o controller
  });

  app.put('/secretaries/:id', { preHandler: [validateSecretaryUniqueFields] }, async (request, reply) => {
    // Implementação existente ou chamada para o controller
  });
}
