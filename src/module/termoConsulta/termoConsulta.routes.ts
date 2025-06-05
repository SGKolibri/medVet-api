import { FastifyInstance } from "fastify";
import {
  createTermoConsultaController,
  getTermoConsultaPdfController,
  getTermosConsultaController,
  deleteTermoConsultaController
} from "./termoConsulta.controller";

export async function termoConsultaRoutes(app: FastifyInstance) {
  // Criar um novo termo de consulta
  app.post("/termos-consulta", createTermoConsultaController);

  // Obter todos os termos de consulta
  app.get("/termos-consulta", getTermosConsultaController);
  
  // Rota adicional para compatibilidade com o frontend
  app.get("/get/termos-consulta", getTermosConsultaController);

  // Obter PDF de um termo de consulta específico
  app.get("/termos-consulta/:id/pdf", getTermoConsultaPdfController);

  // Excluir um termo de consulta
  app.delete("/termos-consulta/:id", deleteTermoConsultaController);
}
