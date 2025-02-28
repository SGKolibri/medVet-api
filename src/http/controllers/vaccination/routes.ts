import { FastifyInstance } from "fastify";
import { updateVaccination } from "@/http/controllers/vaccination/updateVaccinations";
import { deleteVaccination } from "./deleteVaccinations";

export async function vaccinationRoutes(app: FastifyInstance) {
    app.put('/put/vaccinations', updateVaccination)
    app.delete('/delete/vaccinations', deleteVaccination)
} 
